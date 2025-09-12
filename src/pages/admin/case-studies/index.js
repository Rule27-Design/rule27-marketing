// src/pages/admin/case-studies/index.js
import CaseStudies from './CaseStudies';
export default CaseStudies;

// Also export named exports for other uses
export { default as CaseStudyEditor } from './CaseStudyEditor';

// Export editor tabs
export { default as OverviewTab } from './editor-tabs/OverviewTab';
export { default as ResultsTab } from './editor-tabs/ResultsTab';
export { default as MediaTab } from './editor-tabs/MediaTab';
export { default as DetailsTab } from './editor-tabs/DetailsTab';
export { default as AnalyticsTab } from './editor-tabs/AnalyticsTab';

// Export services
export { caseStudyOperations } from './services/CaseStudyOperations';

// Export hooks
export { useCaseStudies } from './hooks/useCaseStudies';
export { useCaseStudyEvents } from './hooks/useCaseStudyEvents';
export { useFormValidation } from './hooks/useFormValidation';
export { useAutoSave } from './hooks/useAutoSave';