// src/pages/admin/services/index.js
export { default as Services } from './Services';
export { default as ServiceEditor } from './ServiceEditor';

// Export editor tabs
export { default as BasicInfoTab } from './editor-tabs/BasicInfoTab';
export { default as FeaturesTab } from './editor-tabs/FeaturesTab';
export { default as PricingTab } from './editor-tabs/PricingTab';
export { default as ProcessTab } from './editor-tabs/ProcessTab';
export { default as MediaTab } from './editor-tabs/MediaTab';
export { default as SettingsTab } from './editor-tabs/SettingsTab';

// Export services
export { serviceOperations, ServiceOperationsService } from './services/ServiceOperations';

// Export hooks
export { useServices } from './hooks/useServices';
export { useServiceEvents } from './hooks/useServiceEvents';
export { useFormValidation } from './hooks/useFormValidation';
export { usePricingCalculation } from './hooks/usePricingCalculation';