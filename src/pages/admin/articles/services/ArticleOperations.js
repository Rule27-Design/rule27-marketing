// src/pages/admin/articles/services/ArticleOperations.js - Command Pattern Implementation
import { supabase } from '../../../../lib/supabase';

/**
 * Base Command interface
 */
class Command {
  constructor(context) {
    this.context = context;
    this.executed = false;
    this.timestamp = new Date().toISOString();
  }

  async execute() {
    throw new Error('Execute method must be implemented');
  }

  async undo() {
    throw new Error('Undo method must be implemented');
  }

  canUndo() {
    return this.executed && this.undoData;
  }

  getDescription() {
    return 'Unknown operation';
  }
}

/**
 * Article Commands
 */
export class PublishArticleCommand extends Command {
  constructor(context, articleId, userId) {
    super(context);
    this.articleId = articleId;
    this.userId = userId;
    this.originalStatus = null;
    this.originalPublishedAt = null;
  }

  async execute() {
    try {
      // Get current state for undo
      const { data: currentArticle } = await supabase
        .from('articles')
        .select('status, published_at')
        .eq('id', this.articleId)
        .single();

      this.originalStatus = currentArticle?.status;
      this.originalPublishedAt = currentArticle?.published_at;

      // Execute publish
      const { data, error } = await supabase
        .from('articles')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          updated_by: this.userId
        })
        .eq('id', this.articleId)
        .select()
        .single();

      if (error) throw error;

      this.executed = true;
      this.undoData = { originalStatus: this.originalStatus, originalPublishedAt: this.originalPublishedAt };
      
      // Emit event
      this.context.eventBus?.emit('article:published', { articleId: this.articleId, article: data });
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async undo() {
    if (!this.canUndo()) {
      return { success: false, error: 'Cannot undo this operation' };
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .update({
          status: this.originalStatus,
          published_at: this.originalPublishedAt,
          updated_by: this.userId
        })
        .eq('id', this.articleId)
        .select()
        .single();

      if (error) throw error;

      this.executed = false;
      this.context.eventBus?.emit('article:unpublished', { articleId: this.articleId, article: data });
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getDescription() {
    return `Publish article ${this.articleId}`;
  }
}

export class ArchiveArticleCommand extends Command {
  constructor(context, articleId, userId) {
    super(context);
    this.articleId = articleId;
    this.userId = userId;
  }

  async execute() {
    try {
      const { data: currentArticle } = await supabase
        .from('articles')
        .select('status, published_at')
        .eq('id', this.articleId)
        .single();

      this.originalStatus = currentArticle?.status;
      this.originalPublishedAt = currentArticle?.published_at;

      const { data, error } = await supabase
        .from('articles')
        .update({
          status: 'archived',
          archived_at: new Date().toISOString(),
          updated_by: this.userId
        })
        .eq('id', this.articleId)
        .select()
        .single();

      if (error) throw error;

      this.executed = true;
      this.undoData = { originalStatus: this.originalStatus };
      
      this.context.eventBus?.emit('article:archived', { articleId: this.articleId, article: data });
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async undo() {
    if (!this.canUndo()) {
      return { success: false, error: 'Cannot undo this operation' };
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .update({
          status: this.originalStatus,
          archived_at: null,
          updated_by: this.userId
        })
        .eq('id', this.articleId)
        .select()
        .single();

      if (error) throw error;

      this.executed = false;
      this.context.eventBus?.emit('article:unarchived', { articleId: this.articleId, article: data });
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getDescription() {
    return `Archive article ${this.articleId}`;
  }
}

export class BulkUpdateCommand extends Command {
  constructor(context, articleIds, updates, userId) {
    super(context);
    this.articleIds = articleIds;
    this.updates = updates;
    this.userId = userId;
    this.originalStates = [];
  }

  async execute() {
    try {
      // Store original states for undo
      const { data: originalArticles } = await supabase
        .from('articles')
        .select('id, status, published_at, archived_at')
        .in('id', this.articleIds);

      this.originalStates = originalArticles || [];

      // Execute bulk update
      const updateData = {
        ...this.updates,
        updated_by: this.userId,
        updated_at: new Date().toISOString()
      };

      // Add specific timestamps based on status
      if (this.updates.status === 'published') {
        updateData.published_at = new Date().toISOString();
      } else if (this.updates.status === 'archived') {
        updateData.archived_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('articles')
        .update(updateData)
        .in('id', this.articleIds)
        .select();

      if (error) throw error;

      this.executed = true;
      this.undoData = { originalStates: this.originalStates };
      
      this.context.eventBus?.emit('articles:bulk_updated', { 
        articleIds: this.articleIds, 
        updates: this.updates, 
        articles: data 
      });
      
      return { success: true, data, count: this.articleIds.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async undo() {
    if (!this.canUndo()) {
      return { success: false, error: 'Cannot undo this operation' };
    }

    try {
      // Restore each article to its original state
      const restorePromises = this.originalStates.map(original => 
        supabase
          .from('articles')
          .update({
            status: original.status,
            published_at: original.published_at,
            archived_at: original.archived_at,
            updated_by: this.userId
          })
          .eq('id', original.id)
      );

      await Promise.all(restorePromises);

      this.executed = false;
      this.context.eventBus?.emit('articles:bulk_undone', { articleIds: this.articleIds });
      
      return { success: true, count: this.articleIds.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getDescription() {
    const updateTypes = Object.keys(this.updates).join(', ');
    return `Bulk update ${this.articleIds.length} articles: ${updateTypes}`;
  }
}

export class DeleteArticleCommand extends Command {
  constructor(context, articleId, userId) {
    super(context);
    this.articleId = articleId;
    this.userId = userId;
    this.deletedArticle = null;
  }

  async execute() {
    try {
      // Get full article data for potential restore
      const { data: article } = await supabase
        .from('articles')
        .select('*')
        .eq('id', this.articleId)
        .single();

      this.deletedArticle = article;

      // Soft delete (mark as deleted)
      const { data, error } = await supabase
        .from('articles')
        .update({
          status: 'deleted',
          deleted_at: new Date().toISOString(),
          deleted_by: this.userId
        })
        .eq('id', this.articleId)
        .select()
        .single();

      if (error) throw error;

      this.executed = true;
      this.undoData = { deletedArticle: this.deletedArticle };
      
      this.context.eventBus?.emit('article:deleted', { articleId: this.articleId, article: this.deletedArticle });
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async undo() {
    if (!this.canUndo()) {
      return { success: false, error: 'Cannot undo this operation' };
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .update({
          status: this.deletedArticle.status || 'draft',
          deleted_at: null,
          deleted_by: null,
          updated_by: this.userId
        })
        .eq('id', this.articleId)
        .select()
        .single();

      if (error) throw error;

      this.executed = false;
      this.context.eventBus?.emit('article:restored', { articleId: this.articleId, article: data });
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getDescription() {
    return `Delete article ${this.articleId}`;
  }
}

export class DuplicateArticleCommand extends Command {
  constructor(context, sourceArticleId, userId) {
    super(context);
    this.sourceArticleId = sourceArticleId;
    this.userId = userId;
    this.duplicatedArticle = null;
  }

  async execute() {
    try {
      // Get source article
      const { data: sourceArticle } = await supabase
        .from('articles')
        .select('*')
        .eq('id', this.sourceArticleId)
        .single();

      if (!sourceArticle) throw new Error('Source article not found');

      // Create duplicate
      const duplicateData = {
        ...sourceArticle,
        id: undefined,
        title: `${sourceArticle.title} (Copy)`,
        slug: `${sourceArticle.slug}-copy-${Date.now()}`,
        status: 'draft',
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        published_at: null,
        created_by: this.userId,
        updated_by: this.userId,
        author_id: this.userId
      };

      const { data, error } = await supabase
        .from('articles')
        .insert(duplicateData)
        .select()
        .single();

      if (error) throw error;

      this.duplicatedArticle = data;
      this.executed = true;
      this.undoData = { duplicatedId: data.id };
      
      this.context.eventBus?.emit('article:duplicated', { 
        sourceId: this.sourceArticleId, 
        duplicateId: data.id, 
        article: data 
      });
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async undo() {
    if (!this.canUndo()) {
      return { success: false, error: 'Cannot undo this operation' };
    }

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', this.duplicatedArticle.id);

      if (error) throw error;

      this.executed = false;
      this.context.eventBus?.emit('article:duplicate_removed', { articleId: this.duplicatedArticle.id });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getDescription() {
    return `Duplicate article ${this.sourceArticleId}`;
  }
}

/**
 * Command Manager - Handles execution and undo/redo
 */
export class CommandManager {
  constructor(context) {
    this.context = context;
    this.history = [];
    this.currentIndex = -1;
    this.maxHistorySize = 50;
  }

  async executeCommand(command) {
    try {
      const result = await command.execute();
      
      if (result.success) {
        // Add to history (remove any commands after current index)
        this.history = this.history.slice(0, this.currentIndex + 1);
        this.history.push(command);
        this.currentIndex++;
        
        // Limit history size
        if (this.history.length > this.maxHistorySize) {
          this.history.shift();
          this.currentIndex--;
        }
        
        this.context.eventBus?.emit('command:executed', { 
          command: command.getDescription(),
          canUndo: this.canUndo(),
          canRedo: this.canRedo()
        });
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async undo() {
    if (!this.canUndo()) {
      return { success: false, error: 'Nothing to undo' };
    }

    const command = this.history[this.currentIndex];
    const result = await command.undo();
    
    if (result.success) {
      this.currentIndex--;
      this.context.eventBus?.emit('command:undone', { 
        command: command.getDescription(),
        canUndo: this.canUndo(),
        canRedo: this.canRedo()
      });
    }
    
    return result;
  }

  async redo() {
    if (!this.canRedo()) {
      return { success: false, error: 'Nothing to redo' };
    }

    this.currentIndex++;
    const command = this.history[this.currentIndex];
    const result = await command.execute();
    
    if (result.success) {
      this.context.eventBus?.emit('command:redone', { 
        command: command.getDescription(),
        canUndo: this.canUndo(),
        canRedo: this.canRedo()
      });
    } else {
      this.currentIndex--; // Revert on failure
    }
    
    return result;
  }

  canUndo() {
    return this.currentIndex >= 0 && this.history[this.currentIndex]?.canUndo();
  }

  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  getHistory() {
    return this.history.map((command, index) => ({
      description: command.getDescription(),
      timestamp: command.timestamp,
      executed: command.executed,
      canUndo: command.canUndo(),
      isCurrent: index === this.currentIndex
    }));
  }

  clear() {
    this.history = [];
    this.currentIndex = -1;
  }
}

/**
 * Article Operations Service - Factory for commands
 */
export class ArticleOperationsService {
  constructor(context) {
    this.context = context;
    this.commandManager = new CommandManager(context);
  }

  // Command factory methods
  createPublishCommand(articleId, userId) {
    return new PublishArticleCommand(this.context, articleId, userId);
  }

  createArchiveCommand(articleId, userId) {
    return new ArchiveArticleCommand(this.context, articleId, userId);
  }

  createBulkUpdateCommand(articleIds, updates, userId) {
    return new BulkUpdateCommand(this.context, articleIds, updates, userId);
  }

  createDeleteCommand(articleId, userId) {
    return new DeleteArticleCommand(this.context, articleId, userId);
  }

  createDuplicateCommand(sourceArticleId, userId) {
    return new DuplicateArticleCommand(this.context, sourceArticleId, userId);
  }

  // Convenience methods
  async publishArticle(articleId, userId) {
    const command = this.createPublishCommand(articleId, userId);
    return this.commandManager.executeCommand(command);
  }

  async archiveArticle(articleId, userId) {
    const command = this.createArchiveCommand(articleId, userId);
    return this.commandManager.executeCommand(command);
  }

  async bulkUpdateArticles(articleIds, updates, userId) {
    const command = this.createBulkUpdateCommand(articleIds, updates, userId);
    return this.commandManager.executeCommand(command);
  }

  async deleteArticle(articleId, userId) {
    const command = this.createDeleteCommand(articleId, userId);
    return this.commandManager.executeCommand(command);
  }

  async duplicateArticle(sourceArticleId, userId) {
    const command = this.createDuplicateCommand(sourceArticleId, userId);
    return this.commandManager.executeCommand(command);
  }

  // Undo/Redo
  async undo() {
    return this.commandManager.undo();
  }

  async redo() {
    return this.commandManager.redo();
  }

  canUndo() {
    return this.commandManager.canUndo();
  }

  canRedo() {
    return this.commandManager.canRedo();
  }

  getHistory() {
    return this.commandManager.getHistory();
  }
}