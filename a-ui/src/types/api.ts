/**
 * API Type Definitions
 * Mirrors the backend API contracts from b-api module
 */

import { PaginationMeta, ApiResponse, PaginatedResponse } from './common';

// Product API types
export interface ProductDto {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  rating?: number;
  imageUrls: string[];
  stockQuantity?: number;
  restockThreshold?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrls?: string[];
  restockThreshold?: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  imageUrls?: string[];
  restockThreshold?: number;
  isActive?: boolean;
}

// Cart API types
export interface CartDto {
  id: string;
  customerId: string;
  status: string;
  cartItems: CartItemDto[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemDto {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  itemPrice: number;
  totalPrice: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Customer API types
export interface CustomerDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: AddressDto;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressDto {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: AddressDto;
}

// Order API types
export interface OrderDto {
  id: string;
  customerId: string;
  cartId: string;
  status: string;
  totalAmount: number;
  shippingAddress: AddressDto;
  paymentInfo: PaymentDto;
  orderItems: OrderItemDto[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemDto {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PaymentDto {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  method: string;
  transactionId?: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  cartId: string;
  shippingAddress: AddressDto;
  paymentMethod: string;
}

// Review API types
export interface ReviewDto {
  id: string;
  productId: string;
  customerId: string;
  rating: number;
  comment?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  comment?: string;
  images?: string[];
}

// Inventory API types
export interface InventoryDto {
  id: string;
  productId: string;
  stockQuantity: number;
  restockThreshold: number;
  lastRestocked?: string;
  updatedAt: string;
}

export interface UpdateInventoryRequest {
  stockQuantity: number;
  restockThreshold?: number;
}

// Promotion API types
export interface PromotionDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minimumOrderAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyPromotionRequest {
  cartId: string;
  promotionCode: string;
}

// Search API types
export interface ProductSearchRequest {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'rating' | 'created';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ProductSearchResponse extends PaginatedResponse<ProductDto> {
  filters: {
    categories: Array<{ id: string; name: string; count: number }>;
    priceRange: { min: number; max: number };
    ratings: Array<{ rating: number; count: number }>;
  };
}

// Wishlist API types
export interface WishlistDto {
  id: string;
  customerId: string;
  items: WishlistItemDto[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItemDto {
  id: string;
  wishlistId: string;
  productId: string;
  addedAt: string;
}

export interface AddToWishlistRequest {
  productId: string;
}

// Error response types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ValidationError[];
    timestamp: string;
  };
}

// Response type aliases for convenience
export type ProductResponse = ApiResponse<ProductDto>;
export type ProductListResponse = PaginatedResponse<ProductDto>;
export type CategoryResponse = ApiResponse<CategoryDto>;
export type CategoryListResponse = ApiResponse<CategoryDto[]>;
export type CartResponse = ApiResponse<CartDto>;
export type OrderResponse = ApiResponse<OrderDto>;
export type OrderListResponse = PaginatedResponse<OrderDto>;
export type ReviewResponse = ApiResponse<ReviewDto>;
export type ReviewListResponse = PaginatedResponse<ReviewDto>;
export type InventoryResponse = ApiResponse<InventoryDto>;
export type PromotionResponse = ApiResponse<PromotionDto>;
export type WishlistResponse = ApiResponse<WishlistDto>;
