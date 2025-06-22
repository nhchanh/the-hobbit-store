/**
 * Promotion Domain to DTO Mappers
 * Maps between promotion aggregates and DTOs for API communication
 */

import { Promotion } from '../../domain/aggregates/promotion/Promotion';
import {
  PromotionDto,
  CreatePromotionDto,
  UpdatePromotionDto,
  PromotionUsageDto
} from '../dto/PromotionDto';

export class PromotionMapper {
  /**
   * Maps Promotion domain aggregate to DTO
   */
  static toDto(promotion: Promotion): PromotionDto {
    return {
      id: promotion.id.value,
      code: promotion.code.value(),
      name: promotion.name,
      description: promotion.description,
      type: promotion.type as any, // Type assertion for enum compatibility
      status: promotion.status as any, // Type assertion for enum compatibility

      // Discount configuration
      discountPercentage: promotion.discountPercentage?.value(),
      fixedDiscountAmount: promotion.fixedDiscount?.amount().amount,
      fixedDiscountCurrency: promotion.fixedDiscount?.amount().currency,

      // Purchase requirements
      minimumPurchaseAmount: promotion.minimumPurchaseAmount?.amount().amount,
      minimumPurchaseCurrency: promotion.minimumPurchaseAmount?.amount().currency,

      // Usage limits
      usageLimit: promotion.usageLimit.value(),
      usageCount: promotion.usageHistory.length,

      // Validity period
      startDate: promotion.period.startDate().toISOString(),
      endDate: promotion.period.endDate().toISOString(),

      // Applicable products
      applicableProductIds: promotion.applicableProductIds.map(id => id.value),
      applicableCategoryIds: [], // Not implemented in domain yet
      excludedProductIds: [], // Not implemented in domain yet

      // Audit fields
      createdAt: promotion.createdAt.toISOString(),
      updatedAt: promotion.updatedAt.toISOString(),
    };
  }

  /**
   * Maps CreatePromotionDto to domain factory parameters
   */
  static fromCreateDto(dto: CreatePromotionDto) {
    return {
      code: dto.code,
      name: dto.name,
      description: dto.description,
      type: dto.type,
      discountPercentage: dto.discountPercentage,
      fixedDiscountAmount: dto.fixedDiscountAmount,
      fixedDiscountCurrency: dto.fixedDiscountCurrency || 'USD',
      minimumPurchaseAmount: dto.minimumPurchaseAmount,
      minimumPurchaseCurrency: dto.minimumPurchaseCurrency || 'USD',
      usageLimit: dto.usageLimit,
      maxUsagePerCustomer: dto.maxUsagePerCustomer,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      applicableProductIds: dto.applicableProductIds || [],
      applicableCategoryIds: dto.applicableCategoryIds || [],
      excludedProductIds: dto.excludedProductIds || [],
    };
  }

  /**
   * Maps UpdatePromotionDto to domain update parameters
   */
  static fromUpdateDto(dto: UpdatePromotionDto) {
    return {
      name: dto.name,
      description: dto.description,
      discountPercentage: dto.discountPercentage,
      fixedDiscountAmount: dto.fixedDiscountAmount,
      minimumPurchaseAmount: dto.minimumPurchaseAmount,
      minimumQuantity: dto.minimumQuantity,
      usageLimit: dto.usageLimit,
      maxUsagePerCustomer: dto.maxUsagePerCustomer,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      applicableProductIds: dto.applicableProductIds,
      applicableCategoryIds: dto.applicableCategoryIds,
      excludedProductIds: dto.excludedProductIds,
    };
  }

  /**
   * Maps array of Promotion aggregates to DTOs
   */
  static toDtoArray(promotions: Promotion[]): PromotionDto[] {
    return promotions.map(promotion => this.toDto(promotion));
  }

  /**
   * Maps promotion usage from domain to DTO
   */
  static usageToDto(
    promotionId: string,
    customerId: string,
    orderId: string,
    usageData: {
      usedAt: Date;
      orderAmount: number;
      discountAmount: number;
      currency: string;
    }
  ): Omit<PromotionUsageDto, 'id'> {
    return {
      promotionId,
      customerId,
      orderId,
      usedAt: usageData.usedAt.toISOString(),
      orderAmount: usageData.orderAmount,
      discountAmount: usageData.discountAmount,
      currency: usageData.currency,
    };
  }

  /**
   * Maps promotion for validation context
   */
  static toValidationContext(promotion: Promotion) {
    return {
      id: promotion.id.value,
      code: promotion.code.value(),
      type: promotion.type,
      status: promotion.status,
      discountPercentage: promotion.discountPercentage?.value(),
      fixedDiscountAmount: promotion.fixedDiscount?.amount().amount,
      minimumPurchaseAmount: promotion.minimumPurchaseAmount?.amount().amount,
      usageLimit: promotion.usageLimit.value(),
      currentUsageCount: promotion.usageHistory.length,
      startDate: promotion.period.startDate(),
      endDate: promotion.period.endDate(),
      applicableProductIds: promotion.applicableProductIds.map(id => id.value),
    };
  }
}

export default PromotionMapper;
