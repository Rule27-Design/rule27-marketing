// src/pages/admin/case-studies/index.js
export { default as CaseStudies } from './CaseStudies';
export { default as CaseStudyEditor } from './CaseStudyEditor';

// Export editor tabs
export { default as OverviewTab } from './editor-tabs/OverviewTab';
export { default as ContentTab } from './editor-tabs/ContentTab';
export { default as MediaTab } from './editor-tabs/MediaTab';
export { default as MetricsTab } from './editor-tabs/MetricsTab';
export { default as TeamTab } from './editor-tabs/TeamTab';
export { default as SettingsTab } from './editor-tabs/SettingsTab';

// Export services
export { caseStudyOperations, CaseStudyOperationsService } from './services/CaseStudyOperations';

// Export hooks
export { useCaseStudies } from './hooks/useCaseStudies';
export { useCaseStudyEvents } from './hooks/useCaseStudyEvents';
export { useFormValidation } from './hooks/useFormValidation';
export { useMetricsCalculation } from './hooks/useMetricsCalculation';