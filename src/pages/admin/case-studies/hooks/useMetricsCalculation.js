// src/pages/admin/case-studies/hooks/useMetricsCalculation.js
import { useCallback } from 'react';

export const useMetricsCalculation = () => {
  const calculateImprovement = useCallback((before, after, type = 'percentage') => {
    // Clean and parse values
    const cleanValue = (val) => {
      if (typeof val !== 'string') return 0;
      // Remove currency symbols, commas, and other non-numeric chars except decimal and minus
      return parseFloat(val.replace(/[^0-9.-]/g, ''));
    };

    const beforeValue = cleanValue(before);
    const afterValue = cleanValue(after);

    if (isNaN(beforeValue) || isNaN(afterValue)) {
      return '';
    }

    let improvement;
    
    switch (type) {
      case 'percentage':
        if (beforeValue === 0) {
          improvement = afterValue > 0 ? '+100%' : '0%';
        } else {
          const percentChange = ((afterValue - beforeValue) / Math.abs(beforeValue)) * 100;
          improvement = `${percentChange > 0 ? '+' : ''}${Math.round(percentChange)}%`;
        }
        break;
        
      case 'number':
        const diff = afterValue - beforeValue;
        improvement = `${diff > 0 ? '+' : ''}${diff.toLocaleString()}`;
        break;
        
      case 'currency':
        const moneyDiff = afterValue - beforeValue;
        improvement = `${moneyDiff > 0 ? '+' : ''}$${Math.abs(moneyDiff).toLocaleString()}`;
        break;
        
      case 'time':
        // Assume values are in seconds or similar unit
        const timeDiff = afterValue - beforeValue;
        if (Math.abs(timeDiff) < 60) {
          improvement = `${timeDiff > 0 ? '+' : ''}${timeDiff}s`;
        } else if (Math.abs(timeDiff) < 3600) {
          improvement = `${timeDiff > 0 ? '+' : ''}${Math.round(timeDiff / 60)}m`;
        } else {
          improvement = `${timeDiff > 0 ? '+' : ''}${Math.round(timeDiff / 3600)}h`;
        }
        break;
        
      default:
        improvement = '';
    }

    return improvement;
  }, []);

  const formatMetricValue = useCallback((value, type = 'number') => {
    if (!value) return '';

    switch (type) {
      case 'percentage':
        return `${value}%`;
      case 'currency':
        return `$${parseFloat(value).toLocaleString()}`;
      case 'number':
        return parseFloat(value).toLocaleString();
      case 'time':
        return value;
      default:
        return value;
    }
  }, []);

  const getMetricColor = useCallback((improvement) => {
    if (!improvement || typeof improvement !== 'string') return 'gray';
    
    const value = parseFloat(improvement.replace(/[^0-9.-]/g, ''));
    
    if (isNaN(value)) return 'gray';
    if (value > 0) return 'green';
    if (value < 0) return 'red';
    return 'gray';
  }, []);

  return {
    calculateImprovement,
    formatMetricValue,
    getMetricColor
  };
};