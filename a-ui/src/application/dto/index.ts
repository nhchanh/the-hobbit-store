/**
 * Application Layer DTOs
 * Data Transfer Objects for API communication
 */

// Re-export all DTOs for easy imports
export * from './CartDto';
export * from './ProductDto';
export * from './CustomerDto';
export * from './ReviewDto';
export * from './OrderDto';
export * from './InventoryDto';
export * from './PromotionDto';

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  currency: string;
  categoryId: string;
  imageUrls: string[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  categoryId?: string;
  imageUrls?: string[];
}

// Cart DTOs
export interface CartDto {
  id: string;
  customerId: string;
  items: CartItemDto[];
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemDto {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

// Customer DTOs
export interface CustomerDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  addresses: AddressDto[];
  createdAt: string;
  updatedAt: string;
}

export interface AddressDto {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface CreateCustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
}

// Order DTOs
export interface OrderDto {
  id: string;
  customerId: string;
  items: OrderItemDto[];
  totalAmount: number;
  currency: string;
  status: string;
  shippingAddress: AddressDto;
  billingAddress: AddressDto;
  paymentMethod: string;
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
  currency: string;
}

export interface CreateOrderDto {
  cartId: string;
  shippingAddressId: string;
  billingAddressId: string;
  paymentMethodId: string;
}

// Review DTOs
export interface ReviewDto {
  id: string;
  productId: string;
  customerId: string;
  title: string;
  comment: string;
  rating: number;
  status: string;
  verificationStatus: string;
  helpfulnessCount: number;
  images: ReviewImageDto[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewImageDto {
  id: string;
  reviewId: string;
  imageUrl: string;
  caption?: string;
  displayOrder: number;
}

export interface CreateReviewDto {
  productId: string;
  title: string;
  comment: string;
  rating: number;
  images?: Array<{
    imageUrl: string;
    caption?: string;
  }>;
}

// Inventory DTOs
export interface InventoryDto {
  productId: string;
  stockQuantity: number;
  restockThreshold: number;
  lastRestocked: string;
  status: string;
  locationCode?: string;
}

export interface UpdateInventoryDto {
  stockQuantity?: number;
  restockThreshold?: number;
  locationCode?: string;
}

// Promotion DTOs
export interface PromotionDto {
  id: string;
  code: string;
  name: string;
  description: string;
  type: string;
  discountPercentage?: number;
  fixedDiscountAmount?: number;
  fixedDiscountCurrency?: string;
  minimumPurchaseAmount?: number;
  minimumPurchaseCurrency?: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  status: string;
  applicableProductIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionDto {
  code: string;
  name: string;
  description: string;
  type: 'PERCENTAGE_DISCOUNT' | 'FIXED_AMOUNT_DISCOUNT' | 'FREE_SHIPPING';
  discountPercentage?: number;
  fixedDiscountAmount?: number;
  fixedDiscountCurrency?: string;
  minimumPurchaseAmount?: number;
  minimumPurchaseCurrency?: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  applicableProductIds?: string[];
}

export interface ApplyPromotionDto {
  promotionCode: string;
  customerId: string;
  orderAmount: number;
  currency: string;
  productIds?: string[];
}

// Wishlist DTOs
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

export interface AddToWishlistDto {
  productId: string;
}

// API Response DTOs
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  success: false;
}
