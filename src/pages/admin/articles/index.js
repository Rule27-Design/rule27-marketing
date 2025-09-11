// src/pages/admin/articles/index.js
// Export Articles as default for Routes.jsx
import Articles from './Articles';
export default Articles;

// Also export named exports for other uses
export { default as ArticleEditor } from './ArticleEditor';

// Export editor tabs
export { default as ContentTab } from './editor-tabs/ContentTab';
export { default as MediaTab } from './editor-tabs/MediaTab';
export { default as SEOTab } from './editor-tabs/SEOTab';
export { default as SettingsTab } from './editor-tabs/SettingsTab';
export { default as AnalyticsTab } from './editor-tabs/AnalyticsTab';

// Export services
export { articleOperations } from './services/ArticleOperations';

// Export hooks
export { useArticles } from './hooks/useArticles';
export { useArticleEvents } from './hooks/useArticleEvents';
export { useFormValidation } from './hooks/useFormValidation';
export { useAutoSave } from './hooks/useAutoSave';
