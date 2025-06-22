/**
 * Order Data Transfer Objects
 * Used for API communication and Redux state
 */

import { AddressDto } from './CustomerDto';
import { CartItemDto } from './CartDto';

export interface OrderDto {
  id: string;
  customerId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  items: OrderItemDto[];
  billing: BillingInfoDto;
  shipping: ShippingInfoDto;
  payment: PaymentDto;
  totals: OrderTotalsDto;
  notes?: string;
  tracking?: TrackingInfoDto;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemDto {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  itemPrice: number;
  imageUrl?: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
}

export interface BillingInfoDto {
  firstName: string;
  lastName: string;
  company?: string;
  address: AddressDto;
  email: string;
  phoneNumber?: string;
}

export interface ShippingInfoDto {
  firstName: string;
  lastName: string;
  company?: string;
  address: AddressDto;
  phoneNumber?: string;
  method: ShippingMethodDto;
  instructions?: string;
}

export interface ShippingMethodDto {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
  trackingSupported: boolean;
}

export interface PaymentDto {
  id: string;
  orderId: string;
  method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  amount: number;
  currency: string;
  transactionId?: string;
  gateway?: string;
  processingFee?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderTotalsDto {
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
}

export interface TrackingInfoDto {
  trackingNumber: string;
  carrier: string;
  status: 'LABEL_CREATED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'EXCEPTION';
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingUrl?: string;
  updates: TrackingUpdateDto[];
}

export interface TrackingUpdateDto {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

export interface CreateOrderDto {
  cartId: string;
  billingInfo: BillingInfoDto;
  shippingInfo: ShippingInfoDto;
  paymentMethod: {
    method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
    token?: string; // For credit card payments
    details?: any; // Payment method specific details
  };
  promotionCode?: string;
  notes?: string;
}

export interface OrderSearchDto {
  customerId?: string;
  status?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface OrderSearchResultDto {
  orders: OrderDto[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
