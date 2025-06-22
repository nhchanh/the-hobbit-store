/**
 * Cart API Client
 * Handles HTTP communication with cart endpoints
 */

import { ApiClient } from './ApiClient';
import { CartDto, AddToCartDto, UpdateCartItemDto } from '../../application/dto/CartDto';

export class CartApiClient extends ApiClient {
  private readonly basePath = '/carts';

  /**
   * Get cart by customer ID
   */
  async getByCustomerId(customerId: string): Promise<CartDto | null> {
    try {
      const response = await this.get<CartDto>(`${this.basePath}/customer/${customerId}`);
      return response.data;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get cart by ID
   */
  async getById(cartId: string): Promise<CartDto | null> {
    try {
      const response = await this.get<CartDto>(`${this.basePath}/${cartId}`);
      return response.data;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create new cart
   */
  async create(customerId: string): Promise<CartDto> {
    const response = await this.post<CartDto>(this.basePath, { customerId });
    return response.data;
  }

  /**
   * Add item to cart
   */
  async addItem(cartId: string, addItemDto: AddToCartDto): Promise<CartDto> {
    const response = await this.post<CartDto>(`${this.basePath}/${cartId}/items`, addItemDto);
    return response.data;
  }

  /**
   * Update cart item
   */
  async updateItem(cartId: string, itemId: string, updateDto: UpdateCartItemDto): Promise<CartDto> {
    const response = await this.put<CartDto>(`${this.basePath}/${cartId}/items/${itemId}`, updateDto);
    return response.data;
  }

  /**
   * Remove item from cart
   */
  async removeItem(cartId: string, itemId: string): Promise<CartDto> {
    const response = await this.delete<CartDto>(`${this.basePath}/${cartId}/items/${itemId}`);
    return response.data;
  }

  /**
   * Clear cart (remove all items)
   */
  async clear(cartId: string): Promise<CartDto> {
    const response = await this.delete<CartDto>(`${this.basePath}/${cartId}/items`);
    return response.data;
  }

  /**
   * Apply promotion to cart
   */
  async applyPromotion(cartId: string, promotionCode: string): Promise<CartDto> {
    const response = await this.post<CartDto>(`${this.basePath}/${cartId}/promotions`, {
      promotionCode
    });
    return response.data;
  }

  /**
   * Remove promotion from cart
   */
  async removePromotion(cartId: string): Promise<CartDto> {
    const response = await this.delete<CartDto>(`${this.basePath}/${cartId}/promotions`);
    return response.data;
  }

  /**
   * Calculate cart totals
   */
  async calculateTotals(cartId: string): Promise<{
    subtotal: number;
    discounts: number;
    taxes: number;
    total: number;
    currency: string;
  }> {
    const response = await this.get<{
      subtotal: number;
      discounts: number;
      taxes: number;
      total: number;
      currency: string;
    }>(`${this.basePath}/${cartId}/totals`);
    return response.data;
  }

  /**
   * Validate cart for checkout
   */
  async validateForCheckout(cartId: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const response = await this.get<{
      valid: boolean;
      errors: string[];
      warnings: string[];
    }>(`${this.basePath}/${cartId}/validate`);
    return response.data;
  }

  /**
   * Convert cart to order (checkout)
   */
  async convertToOrder(cartId: string, checkoutData: {
    shippingAddressId: string;
    billingAddressId: string;
    paymentMethodId: string;
    promotionCode?: string;
  }): Promise<{ orderId: string }> {
    const response = await this.post<{ orderId: string }>(`${this.basePath}/${cartId}/checkout`, checkoutData);
    return response.data;
  }

  /**
   * Get cart summary (lightweight version for navigation/header)
   */
  async getSummary(cartId: string): Promise<{
    itemCount: number;
    totalPrice: number;
    currency: string;
  }> {
    const response = await this.get<{
      itemCount: number;
      totalPrice: number;
      currency: string;
    }>(`${this.basePath}/${cartId}/summary`);
    return response.data;
  }
}
