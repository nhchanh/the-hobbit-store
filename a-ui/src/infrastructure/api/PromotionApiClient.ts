/**
 * Promotion API Client
 * Handles HTTP communication with promotion endpoints
 */

import { ApiClient } from './ApiClient';
import { PromotionDto, CreatePromotionDto, UpdatePromotionDto } from '../../application/dto/PromotionDto';

export class PromotionApiClient extends ApiClient {
  private readonly basePath = '/promotions';

  /**
   * Get promotion by ID
   */
  async getById(promotionId: string): Promise<PromotionDto | null> {
    try {
      const response = await this.get<PromotionDto>(`${this.basePath}/${promotionId}`);
      return response.data;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get promotion by code
   */
  async getByCode(code: string): Promise<PromotionDto | null> {
    try {
      const response = await this.get<PromotionDto>(`${this.basePath}/code/${code}`);
      return response.data;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get all promotions with optional filters
   */
  async getAll(filters?: {
    type?: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_X_GET_Y' | 'FREE_SHIPPING';
    status?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'SCHEDULED';
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string
    minOrderValue?: number;
    page?: number;
    limit?: number;
  }): Promise<{
    data: PromotionDto[];
    totalCount: number;
    page: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${this.basePath}?${queryParams.toString()}`
      : this.basePath;

    const response = await this.get<{
      data: PromotionDto[];
      totalCount: number;
      page: number;
      limit: number;
    }>(url);

    return response.data;
  }

  /**
   * Get active promotions
   */
  async getActive(): Promise<PromotionDto[]> {
    const response = await this.get<PromotionDto[]>(`${this.basePath}/active`);
    return response.data;
  }

  /**
   * Get expired promotions
   */
  async getExpired(): Promise<PromotionDto[]> {
    const response = await this.get<PromotionDto[]>(`${this.basePath}/expired`);
    return response.data;
  }

  /**
   * Create new promotion
   */
  async create(createDto: CreatePromotionDto): Promise<PromotionDto> {
    const response = await this.post<PromotionDto>(this.basePath, createDto);
    return response.data;
  }

  /**
   * Update existing promotion
   */
  async update(promotionId: string, updateDto: UpdatePromotionDto): Promise<PromotionDto> {
    const response = await this.put<PromotionDto>(`${this.basePath}/${promotionId}`, updateDto);
    return response.data;
  }

  /**
   * Delete promotion
   */
  async deletePromotion(promotionId: string): Promise<void> {
    await this.delete<void>(`${this.basePath}/${promotionId}`);
  }

  /**
   * Activate promotion
   */
  async activate(promotionId: string): Promise<PromotionDto> {
    const response = await this.patch<PromotionDto>(`${this.basePath}/${promotionId}/activate`);
    return response.data;
  }

  /**
   * Deactivate promotion
   */
  async deactivate(promotionId: string): Promise<PromotionDto> {
    const response = await this.patch<PromotionDto>(`${this.basePath}/${promotionId}/deactivate`);
    return response.data;
  }

  /**
   * Validate promotion code
   */
  async validateCode(code: string, customerId: string, cartTotal: number): Promise<{
    valid: boolean;
    errors: string[];
    discount?: number;
    promotion?: PromotionDto;
  }> {
    const response = await this.post<{
      valid: boolean;
      errors: string[];
      discount?: number;
      promotion?: PromotionDto;
    }>(`${this.basePath}/validate`, {
      code,
      customerId,
      cartTotal
    });
    return response.data;
  }

  /**
   * Calculate discount for given cart
   */
  async calculateDiscount(promotionId: string, cartData: {
    customerId: string;
    totalAmount: number;
    items: {
      productId: string;
      quantity: number;
      unitPrice: number;
    }[];
  }): Promise<{
    discountAmount: number;
    finalAmount: number;
    details: string;
  }> {
    const response = await this.post<{
      discountAmount: number;
      finalAmount: number;
      details: string;
    }>(`${this.basePath}/${promotionId}/calculate`, cartData);
    return response.data;
  }

  /**
   * Get promotion usage statistics
   */
  async getUsageStats(promotionId: string): Promise<{
    totalUsage: number;
    totalDiscount: number;
    uniqueCustomers: number;
    averageOrderValue: number;
    conversionRate: number;
    usageByDay: Array<{
      date: string;
      usage: number;
      discount: number;
    }>;
  }> {
    const response = await this.get<{
      totalUsage: number;
      totalDiscount: number;
      uniqueCustomers: number;
      averageOrderValue: number;
      conversionRate: number;
      usageByDay: Array<{
        date: string;
        usage: number;
        discount: number;
      }>;
    }>(`${this.basePath}/${promotionId}/stats`);
    return response.data;
  }

  /**
   * Get promotions applicable to a specific customer/cart
   */
  async getApplicablePromotions(customerId: string, cartTotal: number): Promise<PromotionDto[]> {
    const response = await this.get<PromotionDto[]>(
      `${this.basePath}/applicable?customerId=${customerId}&cartTotal=${cartTotal}`
    );
    return response.data;
  }
}
