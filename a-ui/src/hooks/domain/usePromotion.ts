/**
 * Promotion Domain Hook
 * Provides promotion-related business logic following DDD principles
 */

import { useCallback } from 'react';
import { Promotion } from '../../../domain/aggregates/promotion/Promotion';
import { PromotionStatus, PromotionType } from '../../../domain/valueobjects/promotion/PromotionValues';
import { Money } from '../../../domain/valueobjects/shared/Money';

// Mock data for demonstration - would be replaced with real Redux selectors
const mockPromotions: Promotion[] = [];

export interface UsePromotionReturn {
  // State
  promotions: Promotion[];
  loading: {
    list: boolean;
    create: boolean;
    update: boolean;
    activate: boolean;
    disable: boolean;
    apply: boolean;
  };
  error: {
    list: string | null;
    create: string | null;
    update: string | null;
    activate: string | null;
    disable: string | null;
    apply: string | null;
  };

  // Actions
  fetchPromotions: () => Promise<void>;
  fetchPromotionByCode: (code: string) => Promise<void>;
  createPercentagePromotion: (promotionData: {
    code: string;
    name: string;
    description: string;
    discountPercentage: number;
    startDate: Date;
    endDate: Date;
    usageLimit?: number;
    minimumPurchase?: Money;
    applicableProductIds?: string[];
  }) => Promise<Promotion>;
  createFixedAmountPromotion: (promotionData: {
    code: string;
    name: string;
    description: string;
    fixedAmount: Money;
    startDate: Date;
    endDate: Date;
    usageLimit?: number;
    minimumPurchase?: Money;
    applicableProductIds?: string[];
  }) => Promise<Promotion>;

  // Domain actions
  activatePromotion: (promotionId: string) => Promise<Promotion>;
  disablePromotion: (promotionId: string) => Promise<Promotion>;
  applyPromotionToOrder: (promotionCode: string, orderData: {
    customerId: string;
    amount: Money;
    productIds?: string[];
  }) => Promise<{
    originalAmount: Money;
    discountAmount: Money;
    finalAmount: Money;
    promotion: Promotion;
  }>;
  recordPromotionUsage: (promotionId: string, usageData: {
    customerId: string;
    orderAmount: Money;
    discountAmount: Money;
  }) => Promise<Promotion>;

  // Queries
  getPromotionById: (promotionId: string) => Promotion | undefined;
  getPromotionByCode: (code: string) => Promotion | undefined;
  getActivePromotions: (date?: Date) => Promotion[];
  getPromotionsByType: (type: PromotionType) => Promotion[];
  getPromotionsByStatus: (status: PromotionStatus) => Promotion[];
  getApplicablePromotions: (productIds: string[], amount: Money) => Promotion[];

  // Validation
  validatePromotionCode: (code: string) => boolean;
  canUsePromotion: (promotionCode: string, customerId: string) => boolean;
  isPromotionApplicable: (promotionCode: string, orderData: {
    amount: Money;
    productIds?: string[];
  }) => boolean;

  // Analytics
  getPromotionUsageCount: (promotionId: string) => number;
  getTotalDiscountGiven: (promotionId: string) => Money;
  getTopPerformingPromotions: (limit?: number) => Promotion[];
  getExpiredPromotions: () => Promotion[];
}

export function usePromotion(): UsePromotionReturn {
  // Mock loading states
  const loading = {
    list: false,
    create: false,
    update: false,
    activate: false,
    disable: false,
    apply: false,
  };

  const error = {
    list: null,
    create: null,
    update: null,
    activate: null,
    disable: null,
    apply: null,
  };

  // Actions
  const fetchPromotions = useCallback(async (): Promise<void> => {
    console.log('Fetching promotions');
    // This would dispatch Redux action: dispatch(fetchPromotions())
  }, []);

  const fetchPromotionByCode = useCallback(async (code: string): Promise<void> => {
    console.log('Fetching promotion by code:', code);
    // This would dispatch Redux action: dispatch(fetchPromotionByCode(code))
  }, []);

  const createPercentagePromotion = useCallback(async (promotionData: {
    code: string;
    name: string;
    description: string;
    discountPercentage: number;
    startDate: Date;
    endDate: Date;
    usageLimit?: number;
    minimumPurchase?: Money;
    applicableProductIds?: string[];
  }): Promise<Promotion> => {
    console.log('Creating percentage promotion:', promotionData);

    // Domain logic: Create new promotion aggregate
    const promotion = Promotion.createPercentageDiscount(
      promotionData.code,
      promotionData.name,
      promotionData.description,
      promotionData.discountPercentage,
      promotionData.startDate,
      promotionData.endDate,
      promotionData.usageLimit,
      promotionData.minimumPurchase,
      promotionData.applicableProductIds?.map(id => ({ value: id } as any))
    );

    // This would dispatch Redux action: dispatch(createPromotion(promotionData))
    return promotion;
  }, []);

  const createFixedAmountPromotion = useCallback(async (promotionData: {
    code: string;
    name: string;
    description: string;
    fixedAmount: Money;
    startDate: Date;
    endDate: Date;
    usageLimit?: number;
    minimumPurchase?: Money;
    applicableProductIds?: string[];
  }): Promise<Promotion> => {
    console.log('Creating fixed amount promotion:', promotionData);

    // Domain logic: Create new promotion aggregate
    const promotion = Promotion.createFixedAmountDiscount(
      promotionData.code,
      promotionData.name,
      promotionData.description,
      promotionData.fixedAmount,
      promotionData.startDate,
      promotionData.endDate,
      promotionData.usageLimit,
      promotionData.minimumPurchase,
      promotionData.applicableProductIds?.map(id => ({ value: id } as any))
    );

    // This would dispatch Redux action: dispatch(createPromotion(promotionData))
    return promotion;
  }, []);

  // Domain actions
  const activatePromotion = useCallback(async (promotionId: string): Promise<Promotion> => {
    console.log('Activating promotion:', promotionId);

    const existingPromotion = mockPromotions.find(p => p.id.value === promotionId);
    if (!existingPromotion) {
      throw new Error('Promotion not found');
    }

    // Domain logic: Activate promotion
    const activatedPromotion = existingPromotion.activate();

    // This would dispatch Redux action: dispatch(activatePromotion(promotionId))
    return activatedPromotion;
  }, []);

  const disablePromotion = useCallback(async (promotionId: string): Promise<Promotion> => {
    console.log('Disabling promotion:', promotionId);

    const existingPromotion = mockPromotions.find(p => p.id.value === promotionId);
    if (!existingPromotion) {
      throw new Error('Promotion not found');
    }

    // Domain logic: Disable promotion
    const disabledPromotion = existingPromotion.disable();

    // This would dispatch Redux action: dispatch(disablePromotion(promotionId))
    return disabledPromotion;
  }, []);

  const applyPromotionToOrder = useCallback(async (promotionCode: string, orderData: {
    customerId: string;
    amount: Money;
    productIds?: string[];
  }): Promise<{
    originalAmount: Money;
    discountAmount: Money;
    finalAmount: Money;
    promotion: Promotion;
  }> => {
    console.log('Applying promotion to order:', promotionCode, orderData);

    const promotion = getPromotionByCode(promotionCode);
    if (!promotion) {
      throw new Error('Promotion not found');
    }

    // Domain logic: Apply promotion to amount
    const customerId = { value: orderData.customerId } as any;
    const productIds = orderData.productIds?.map(id => ({ value: id } as any)) || [];

    const finalAmount = promotion.applyToAmount(orderData.amount, customerId, productIds);
    const discountAmount = promotion.calculateDiscountAmount(orderData.amount, customerId, productIds);

    // This would dispatch Redux action: dispatch(applyPromotion({ promotionCode, orderData }))
    return {
      originalAmount: orderData.amount,
      discountAmount,
      finalAmount,
      promotion,
    };
  }, []);

  const recordPromotionUsage = useCallback(async (promotionId: string, usageData: {
    customerId: string;
    orderAmount: Money;
    discountAmount: Money;
  }): Promise<Promotion> => {
    console.log('Recording promotion usage:', promotionId, usageData);

    const existingPromotion = mockPromotions.find(p => p.id.value === promotionId);
    if (!existingPromotion) {
      throw new Error('Promotion not found');
    }

    // Domain logic: Record usage
    const customerId = { value: usageData.customerId } as any;
    const updatedPromotion = existingPromotion.recordUsage(
      customerId,
      usageData.orderAmount,
      usageData.discountAmount
    );

    // This would dispatch Redux action: dispatch(recordPromotionUsage({ promotionId, usageData }))
    return updatedPromotion;
  }, []);

  // Queries
  const getPromotionById = useCallback((promotionId: string): Promotion | undefined => {
    return mockPromotions.find(p => p.id.value === promotionId);
  }, []);

  const getPromotionByCode = useCallback((code: string): Promotion | undefined => {
    return mockPromotions.find(p => p.code.value() === code);
  }, []);

  const getActivePromotions = useCallback((date: Date = new Date()): Promotion[] => {
    return mockPromotions.filter(p => p.isActive(date));
  }, []);

  const getPromotionsByType = useCallback((type: PromotionType): Promotion[] => {
    return mockPromotions.filter(p => p.type === type);
  }, []);

  const getPromotionsByStatus = useCallback((status: PromotionStatus): Promotion[] => {
    return mockPromotions.filter(p => p.status === status);
  }, []);

  const getApplicablePromotions = useCallback((productIds: string[], amount: Money): Promotion[] => {
    const productIdObjects = productIds.map(id => ({ value: id } as any));

    return getActivePromotions().filter(promotion => {
      return promotion.isApplicableToProducts(productIdObjects) &&
             promotion.meetsMinimumPurchase(amount);
    });
  }, [getActivePromotions]);

  // Validation
  const validatePromotionCode = useCallback((code: string): boolean => {
    const promotion = getPromotionByCode(code);
    return promotion !== undefined && promotion.isActive();
  }, [getPromotionByCode]);

  const canUsePromotion = useCallback((promotionCode: string, customerId: string): boolean => {
    const promotion = getPromotionByCode(promotionCode);
    if (!promotion) return false;

    const customerIdObject = { value: customerId } as any;
    return promotion.isActive() && promotion.canBeUsedBy(customerIdObject);
  }, [getPromotionByCode]);

  const isPromotionApplicable = useCallback((promotionCode: string, orderData: {
    amount: Money;
    productIds?: string[];
  }): boolean => {
    const promotion = getPromotionByCode(promotionCode);
    if (!promotion) return false;

    const productIds = orderData.productIds?.map(id => ({ value: id } as any)) || [];

    return promotion.isActive() &&
           promotion.isApplicableToProducts(productIds) &&
           promotion.meetsMinimumPurchase(orderData.amount);
  }, [getPromotionByCode]);

  // Analytics
  const getPromotionUsageCount = useCallback((promotionId: string): number => {
    const promotion = getPromotionById(promotionId);
    return promotion ? promotion.getTotalUsageCount() : 0;
  }, [getPromotionById]);

  const getTotalDiscountGiven = useCallback((promotionId: string): Money => {
    const promotion = getPromotionById(promotionId);
    if (!promotion) return Money.zero();

    // Calculate total discount from usage history
    return promotion.usageHistory.reduce((total, usage) => {
      try {
        return total.add(usage.discountAmount);
      } catch {
        // If different currencies, just return the first total
        return total;
      }
    }, Money.zero());
  }, [getPromotionById]);

  const getTopPerformingPromotions = useCallback((limit: number = 10): Promotion[] => {
    return mockPromotions
      .sort((a, b) => b.getTotalUsageCount() - a.getTotalUsageCount())
      .slice(0, limit);
  }, []);

  const getExpiredPromotions = useCallback((): Promotion[] => {
    return mockPromotions.filter(p => p.hasExpired());
  }, []);

  return {
    // State
    promotions: mockPromotions,
    loading,
    error,

    // Actions
    fetchPromotions,
    fetchPromotionByCode,
    createPercentagePromotion,
    createFixedAmountPromotion,

    // Domain actions
    activatePromotion,
    disablePromotion,
    applyPromotionToOrder,
    recordPromotionUsage,

    // Queries
    getPromotionById,
    getPromotionByCode,
    getActivePromotions,
    getPromotionsByType,
    getPromotionsByStatus,
    getApplicablePromotions,

    // Validation
    validatePromotionCode,
    canUsePromotion,
    isPromotionApplicable,

    // Analytics
    getPromotionUsageCount,
    getTotalDiscountGiven,
    getTopPerformingPromotions,
    getExpiredPromotions,
  };
}
