// src/services/BaseCommand.js

/**
 * Base Command class for implementing Command Pattern
 * Provides undo/redo functionality and command history
 */
export class BaseCommand {
  constructor(type, data = {}) {
    this.id = this.generateId();
    this.type = type;
    this.data = data;
    this.timestamp = Date.now();
    this.executed = false;
    this.executedAt = null;
    this.undone = false;
    this.undoneAt = null;
    this.metadata = {};
    this.error = null;
  }

  /**
   * Generate unique command ID
   */
  generateId() {
    return `cmd_${this.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Execute the command
   * Must be implemented by subclasses
   */
  async execute() {
    throw new Error('Execute method must be implemented by subclass');
  }

  /**
   * Undo the command
   * Must be implemented by subclasses
   */
  async undo() {
    throw new Error('Undo method must be implemented by subclass');
  }

  /**
   * Redo the command (default implementation re-executes)
   */
  async redo() {
    return this.execute();
  }

  /**
   * Check if command can be executed
   */
  canExecute() {
    return !this.executed || this.undone;
  }

  /**
   * Check if command can be undone
   */
  canUndo() {
    return this.executed && !this.undone;
  }

  /**
   * Check if command can be redone
   */
  canRedo() {
    return this.executed && this.undone;
  }

  /**
   * Mark command as executed
   */
  markExecuted() {
    this.executed = true;
    this.executedAt = Date.now();
    this.undone = false;
    this.undoneAt = null;
  }

  /**
   * Mark command as undone
   */
  markUndone() {
    this.undone = true;
    this.undoneAt = Date.now();
  }

  /**
   * Get command description for history display
   */
  getDescription() {
    return `${this.type} command`;
  }

  /**
   * Serialize command for storage
   */
  serialize() {
    return {
      id: this.id,
      type: this.type,
      data: this.data,
      timestamp: this.timestamp,
      executed: this.executed,
      executedAt: this.executedAt,
      undone: this.undone,
      undoneAt: this.undoneAt,
      metadata: this.metadata
    };
  }

  /**
   * Deserialize command from storage
   */
  static deserialize(serialized) {
    const command = new BaseCommand(serialized.type, serialized.data);
    Object.assign(command, serialized);
    return command;
  }
}

/**
 * Composite Command for executing multiple commands as one
 */
export class CompositeCommand extends BaseCommand {
  constructor(commands = [], description = 'Composite Command') {
    super('composite');
    this.commands = commands;
    this.description = description;
    this.executedCommands = [];
  }

  async execute() {
    const results = [];
    
    for (const command of this.commands) {
      try {
        const result = await command.execute();
        this.executedCommands.push(command);
        results.push({ command, result, success: true });
      } catch (error) {
        results.push({ command, error, success: false });
        
        // Rollback on failure
        await this.rollback();
        throw new Error(`Composite command failed: ${error.message}`);
      }
    }
    
    this.markExecuted();
    return results;
  }

  async undo() {
    const results = [];
    
    // Undo in reverse order
    for (let i = this.executedCommands.length - 1; i >= 0; i--) {
      const command = this.executedCommands[i];
      try {
        const result = await command.undo();
        results.push({ command, result, success: true });
      } catch (error) {
        results.push({ command, error, success: false });
        console.error(`Failed to undo command: ${error.message}`);
      }
    }
    
    this.markUndone();
    return results;
  }

  async rollback() {
    // Undo any executed commands in case of failure
    for (let i = this.executedCommands.length - 1; i >= 0; i--) {
      try {
        await this.executedCommands[i].undo();
      } catch (error) {
        console.error(`Rollback failed for command: ${error.message}`);
      }
    }
    this.executedCommands = [];
  }

  getDescription() {
    return this.description;
  }
}

/**
 * Command Manager for managing command history and execution
 */
export class CommandManager {
  constructor(options = {}) {
    this.options = {
      maxHistorySize: 100,
      persistHistory: false,
      storageKey: 'command_history',
      debug: false,
      ...options
    };
    
    this.history = [];
    this.currentIndex = -1;
    this.listeners = new Map();
    this.executing = false;
    
    // Load persisted history if enabled
    if (this.options.persistHistory) {
      this.loadHistory();
    }
  }

  /**
   * Execute a command
   */
  async execute(command) {
    if (this.executing) {
      throw new Error('Another command is currently executing');
    }
    
    this.executing = true;
    
    try {
      // Check if command can be executed
      if (!command.canExecute()) {
        throw new Error('Command cannot be executed in current state');
      }
      
      // Execute the command
      const result = await command.execute();
      command.markExecuted();
      
      // Add to history
      this.addToHistory(command);
      
      // Emit event
      this.emit('execute', { command, result });
      
      // Persist if enabled
      if (this.options.persistHistory) {
        this.saveHistory();
      }
      
      this.debug(`Executed command: ${command.getDescription()}`);
      
      return result;
    } catch (error) {
      command.error = error;
      this.emit('error', { command, error });
      throw error;
    } finally {
      this.executing = false;
    }
  }

  /**
   * Execute multiple commands
   */
  async executeBatch(commands, stopOnError = false) {
    const results = [];
    
    for (const command of commands) {
      try {
        const result = await this.execute(command);
        results.push({ command, result, success: true });
      } catch (error) {
        results.push({ command, error, success: false });
        
        if (stopOnError) {
          break;
        }
      }
    }
    
    return results;
  }

  /**
   * Add command to history
   */
  addToHistory(command) {
    // Remove any commands after current index (for redo functionality)
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    // Add new command
    this.history.push(command);
    this.currentIndex++;
    
    // Limit history size
    if (this.history.length > this.options.maxHistorySize) {
      const removed = this.history.shift();
      this.currentIndex--;
      this.emit('historyTrimmed', { removed });
    }
    
    this.emit('historyChanged', { history: this.history, currentIndex: this.currentIndex });
  }

  /**
   * Undo last command
   */
  async undo() {
    if (!this.canUndo()) {
      throw new Error('Nothing to undo');
    }
    
    const command = this.history[this.currentIndex];
    
    try {
      const result = await command.undo();
      command.markUndone();
      this.currentIndex--;
      
      this.emit('undo', { command, result });
      
      if (this.options.persistHistory) {
        this.saveHistory();
      }
      
      this.debug(`Undone command: ${command.getDescription()}`);
      
      return result;
    } catch (error) {
      command.error = error;
      this.emit('error', { command, error, operation: 'undo' });
      throw error;
    }
  }

  /**
   * Redo next command
   */
  async redo() {
    if (!this.canRedo()) {
      throw new Error('Nothing to redo');
    }
    
    const command = this.history[this.currentIndex + 1];
    
    try {
      const result = await command.redo();
      command.markExecuted();
      this.currentIndex++;
      
      this.emit('redo', { command, result });
      
      if (this.options.persistHistory) {
        this.saveHistory();
      }
      
      this.debug(`Redone command: ${command.getDescription()}`);
      
      return result;
    } catch (error) {
      command.error = error;
      this.emit('error', { command, error, operation: 'redo' });
      throw error;
    }
  }

  /**
   * Check if can undo
   */
  canUndo() {
    return this.currentIndex >= 0 && 
           this.history[this.currentIndex] && 
           this.history[this.currentIndex].canUndo();
  }

  /**
   * Check if can redo
   */
  canRedo() {
    return this.currentIndex < this.history.length - 1 &&
           this.history[this.currentIndex + 1] &&
           this.history[this.currentIndex + 1].canRedo();
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.history = [];
    this.currentIndex = -1;
    
    this.emit('historyCleared');
    
    if (this.options.persistHistory) {
      this.clearPersistedHistory();
    }
  }

  /**
   * Get command history
   */
  getHistory() {
    return this.history.map((cmd, index) => ({
      id: cmd.id,
      type: cmd.type,
      description: cmd.getDescription(),
      timestamp: cmd.timestamp,
      executed: cmd.executed,
      executedAt: cmd.executedAt,
      undone: cmd.undone,
      undoneAt: cmd.undoneAt,
      isCurrent: index === this.currentIndex,
      canUndo: cmd.canUndo(),
      canRedo: cmd.canRedo()
    }));
  }

  /**
   * Get history summary
   */
  getHistorySummary() {
    return {
      total: this.history.length,
      currentIndex: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      executed: this.history.filter(c => c.executed).length,
      undone: this.history.filter(c => c.undone).length
    };
  }

  /**
   * Subscribe to events
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from events
   */
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Emit event
   */
  emit(event, data) {
    if (!this.listeners.has(event)) return;
    
    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  /**
   * Save history to storage
   */
  saveHistory() {
    if (!this.options.persistHistory || typeof window === 'undefined') return;
    
    try {
      const serialized = {
        history: this.history.map(cmd => cmd.serialize()),
        currentIndex: this.currentIndex,
        timestamp: Date.now()
      };
      
      localStorage.setItem(this.options.storageKey, JSON.stringify(serialized));
    } catch (error) {
      console.error('Failed to save command history:', error);
    }
  }

  /**
   * Load history from storage
   */
  loadHistory() {
    if (!this.options.persistHistory || typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.options.storageKey);
      if (!stored) return;
      
      const { history, currentIndex } = JSON.parse(stored);
      
      // Note: This is a simplified deserialization
      // In practice, you'd need to reconstruct proper command instances
      this.history = history;
      this.currentIndex = currentIndex;
      
      this.emit('historyLoaded', { count: this.history.length });
    } catch (error) {
      console.error('Failed to load command history:', error);
    }
  }

  /**
   * Clear persisted history
   */
  clearPersistedHistory() {
    if (!this.options.persistHistory || typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.options.storageKey);
    } catch (error) {
      console.error('Failed to clear persisted history:', error);
    }
  }

  /**
   * Debug logging
   */
  debug(message) {
    if (this.options.debug) {
      console.log(`[CommandManager] ${message}`);
    }
  }
}

export default BaseCommand;