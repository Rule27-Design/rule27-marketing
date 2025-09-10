// src/pages/admin/services/hooks/usePricingCalculation.js
import { useCallback } from 'react';

export const usePricingCalculation = () => {
  const calculateMonthlyPrice = useCallback((price, billingPeriod) => {
    switch (billingPeriod) {
      case 'monthly':
        return price;
      case 'quarterly':
        return price / 3;
      case 'yearly':
        return price / 12;
      default:
        return price;
    }
  }, []);

  const formatPrice = useCallback((price) => {
    if (typeof price !== 'number') return '$0';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(price);
  }, []);

  const calculateDiscount = useCallback((originalPrice, discountedPrice) => {
    if (!originalPrice || !discountedPrice) return 0;
    
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  }, []);

  return {
    calculateMonthlyPrice,
    formatPrice,
    calculateDiscount
  };
};