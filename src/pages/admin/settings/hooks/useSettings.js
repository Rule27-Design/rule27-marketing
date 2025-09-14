// src/pages/admin/settings/hooks/useSettings.js
import { useState, useEffect, useCallback } from 'react';
import { settingsOperations } from '../services/SettingsOperations';

export const useSettings = () => {
  const [data, setData] = useState({
    categories: [],
    tags: [],
    testimonials: [],
    partnerships: [],
    awards: [],
    departments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [categories, tags, testimonials, partnerships, awards, departments] = await Promise.all([
        settingsOperations.getCategories(),
        settingsOperations.getTags(),
        settingsOperations.getTestimonials(),
        settingsOperations.getPartnerships(),
        settingsOperations.getAwards(),
        settingsOperations.getDepartments()
      ]);

      setData({
        categories,
        tags,
        testimonials,
        partnerships,
        awards,
        departments
      });
    } catch (err) {
      console.error('Error fetching settings data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    data,
    loading,
    error,
    refresh: fetchAllData
  };
};