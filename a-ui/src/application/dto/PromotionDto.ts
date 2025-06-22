/**
 * Promotion Data Transfer Objects
 * For API communication and application layer
 */

// Base promotion DTO
export interface PromotionDto {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'PERCENTAGE_DISCOUNT' | 'FIXED_AMOUNT_DISCOUNT' | 'BUY_X_GET_Y' | 'FREE_SHIPPING';
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'DISABLED';

  // Discount configuration
  discountPercentage?: number;
  fixedDiscountAmount?: number;
  fixedDiscountCurrency?: string;

  // Purchase requirements
  minimumPurchaseAmount?: number;
  minimumPurchaseCurrency?: string;
  minimumQuantity?: number;

  // Usage limits
  usageLimit: number;
  usageCount: number;
  maxUsagePerCustomer?: number;

  // Validity period
  startDate: string; // ISO date string
  endDate: string; // ISO date string

  // Applicable products/categories
  applicableProductIds: string[];
  applicableCategoryIds: string[];
  excludedProductIds: string[];

  // Audit fields
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

// DTO for creating new promotions
export interface CreatePromotionDto {
  code: string;
  name: string;
  description: string;
  type: PromotionDto['type'];

  // Discount configuration
  discountPercentage?: number;
  fixedDiscountAmount?: number;
  fixedDiscountCurrency?: string;

  // Purchase requirements
  minimumPurchaseAmount?: number;
  minimumPurchaseCurrency?: string;
  minimumQuantity?: number;

  // Usage limits
  usageLimit: number;
  maxUsagePerCustomer?: number;

  // Validity period
  startDate: string;
  endDate: string;

  // Applicable products/categories
  applicableProductIds?: string[];
  applicableCategoryIds?: string[];
  excludedProductIds?: string[];
}

// DTO for updating promotions
export interface UpdatePromotionDto {
  name?: string;
  description?: string;

  // Discount configuration
  discountPercentage?: number;
  fixedDiscountAmount?: number;

  // Purchase requirements
  minimumPurchaseAmount?: number;
  minimumQuantity?: number;

  // Usage limits
  usageLimit?: number;
  maxUsagePerCustomer?: number;

  // Validity period
  startDate?: string;
  endDate?: string;

  // Applicable products/categories
  applicableProductIds?: string[];
  applicableCategoryIds?: string[];
  excludedProductIds?: string[];
}

// DTO for promotion usage tracking
export interface PromotionUsageDto {
  id: string;
  promotionId: string;
  customerId: string;
  orderId: string;
  usedAt: string;
  orderAmount: number;
  discountAmount: number;
  currency: string;
}

// DTO for promotion validation
export interface PromotionValidationDto {
  promotionCode: string;
  customerId: string;
  cartItems: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  currency: string;
}

// DTO for promotion validation result
export interface PromotionValidationResultDto {
  isValid: boolean;
  promotion?: PromotionDto;
  discountAmount?: number;
  finalAmount?: number;
  errors: string[];
  warnings: string[];
}

// DTO for promotion search and filtering
export interface PromotionSearchDto {
  code?: string;
  name?: string;
  type?: PromotionDto['type'];
  status?: PromotionDto['status'];
  isActive?: boolean;
  startDateAfter?: string;
  startDateBefore?: string;
  endDateAfter?: string;
  endDateBefore?: string;
  productId?: string;
  categoryId?: string;
}

// DTO for promotion analytics
export interface PromotionAnalyticsDto {
  promotionId: string;
  totalUsages: number;
  totalDiscountAmount: number;
  totalOrderValue: number;
  averageOrderValue: number;
  uniqueCustomers: number;
  conversionRate: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    usageCount: number;
    discountAmount: number;
  }>;
  usageOverTime: Array<{
    date: string;
    usageCount: number;
    discountAmount: number;
  }>;
}

// DTO for bulk promotion operations
export interface BulkPromotionActionDto {
  promotionIds: string[];
  action: 'ACTIVATE' | 'DEACTIVATE' | 'PAUSE' | 'DELETE';
  reason?: string;
}

export default PromotionDto;
