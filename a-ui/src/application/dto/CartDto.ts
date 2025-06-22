/**
 * Cart Data Transfer Objects
 * Used for API communication and Redux state
 */

export interface CartItemDto {
  id: string;
  cartId: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  itemPrice: number;
  imageUrl?: string;
}

export interface CartDto {
  id: string;
  customerId: string;
  status: 'ACTIVE' | 'ABANDONED' | 'CHECKED_OUT';
  items: CartItemDto[];
  totalItems: number;
  totalPrice: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface ApplyPromotionDto {
  cartId: string;
  promotionCode: string;
}

export interface CartSummaryDto {
  subtotal: number;
  discounts: number;
  taxes: number;
  total: number;
  currency: string;
  itemCount: number;
}
