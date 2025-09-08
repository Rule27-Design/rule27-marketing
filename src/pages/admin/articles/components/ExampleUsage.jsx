// src/pages/admin/articles/components/ExampleUsage.jsx - How to use the event system
import React, { useEffect } from 'react';
import { 
  useArticleEvents,
  useArticleLifecycleEvents,
  useCollaborationEvents,
  usePerformanceEvents,
  ARTICLE_EVENTS 
} from '../hooks/useArticleEvents.js';

const ExampleArticleComponent = ({ articleId, userId }) => {
  // Basic event hooks
  const { subscribe, emit } = useArticleEvents();
  
  // Specialized event hooks
  useArticleLifecycleEvents({
    onPublished: (article) => {
      console.log('Article published:', article.title);
    },
    onArchived: (article) => {
      console.log('Article archived:', article.title);
    }
  });

  // Collaboration features
  const { collaborators, notifyEdit } = useCollaborationEvents(articleId, userId);

  // Performance monitoring
  const { reportLoadTime, reportRenderTime, metrics } = usePerformanceEvents();

  // Custom event handling
  useEffect(() => {
    const unsubscribers = [];

    // Subscribe to specific events
    unsubscribers.push(
      subscribe('article:saved', ({ article, isUpdate }) => {
        console.log(`Article ${isUpdate ? 'updated' : 'created'}:`, article.title);
      })
    );

    unsubscribers.push(
      subscribe('command:executed', ({ command, canUndo }) => {
        console.log(`Command executed: ${command}, Can undo: ${canUndo}`);
      })
    );

    // Cleanup
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe]);

  // Example: Emit events
  const handleArticleAction = (action) => {
    switch (action) {
      case 'save':
        emit(ARTICLE_EVENTS.UPDATED, { articleId, timestamp: Date.now() });
        break;
      case 'publish':
        emit(ARTICLE_EVENTS.PUBLISHED, { articleId, timestamp: Date.now() });
        break;
      case 'collaborate':
        notifyEdit('title', 'New title value');
        break;
    }
  };

  // Performance tracking example
  useEffect(() => {
    const startTime = performance.now();
    
    // Simulate component load
    setTimeout(() => {
      reportLoadTime(startTime);
    }, 100);
  }, [reportLoadTime]);

  return (
    <div>
      <h3>Article Component</h3>
      
      {/* Show collaborators */}
      {collaborators.length > 0 && (
        <div>
          <p>Active collaborators: {collaborators.length}</p>
        </div>
      )}
      
      {/* Show performance metrics */}
      <div>
        <p>Load time: {metrics.loadTime}ms</p>
        <p>Cache hits: {metrics.cacheHits}</p>
      </div>
      
      {/* Action buttons */}
      <div>
        <button onClick={() => handleArticleAction('save')}>
          Save Article
        </button>
        <button onClick={() => handleArticleAction('publish')}>
          Publish Article
        </button>
        <button onClick={() => handleArticleAction('collaborate')}>
          Notify Collaboration
        </button>
      </div>
    </div>
  );
};

export default ExampleArticleComponent;