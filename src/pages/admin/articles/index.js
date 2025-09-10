// src/pages/admin/articles/index.js
export { default as Articles } from './Articles';
export { default as ArticlesContainer } from './ArticlesContainer';
export { default as ArticleEditor } from './ArticleEditor';

// Export hooks
export * from './hooks/useArticles';
export * from './hooks/useArticleEvents';
export * from './hooks/useFormValidation';
export * from './hooks/useAutoSave';

// Export services
export { ArticleOperationsService } from './services/ArticleOperations';

// Export editor tabs
export { default as ContentTab } from './editor-tabs/ContentTab';
export * from './editor-tabs/MediaTab';
export * from './editor-tabs/SEOTab';
export * from './editor-tabs/SettingsTab';
export * from './editor-tabs/AnalyticsTab';