import { ApiClient } from './ApiClient';
import {
  OrderDto,
  CreateOrderDto,
  OrderSearchDto,
  OrderSearchResultDto,
  OrderItemDto,
  TrackingInfoDto,
  PaymentDto
} from '../../application/dto/OrderDto';

export interface IOrderApiClient {
  // Order CRUD operations
  getOrder(orderId: string): Promise<OrderDto>;
  createOrder(orderData: CreateOrderDto): Promise<OrderDto>;
  updateOrder(orderId: string, updates: UpdateOrderRequest): Promise<OrderDto>;
  cancelOrder(orderId: string, reason: string): Promise<OrderDto>;
  listOrders(customerId?: string): Promise<OrderDto[]>;
  searchOrders(searchParams: OrderSearchDto): Promise<OrderSearchResultDto>;

  // Order lifecycle operations
  confirmOrder(orderId: string): Promise<OrderDto>;
  startProcessing(orderId: string): Promise<OrderDto>;
  shipOrder(orderId: string, shipmentData: ShipOrderRequest): Promise<OrderDto>;
  deliverOrder(orderId: string): Promise<OrderDto>;
  refundOrder(orderId: string, refundData: RefundOrderRequest): Promise<OrderDto>;

  // Order management
  addNotes(orderId: string, notes: string): Promise<OrderDto>;
  updateTrackingInfo(orderId: string, trackingData: UpdateTrackingRequest): Promise<OrderDto>;
  updateEstimatedDelivery(orderId: string, estimatedDelivery: string): Promise<OrderDto>;

  // Order items management
  getOrderItems(orderId: string): Promise<OrderItemDto[]>;
  updateOrderItem(orderId: string, itemId: string, updates: UpdateOrderItemRequest): Promise<OrderDto>;
  removeOrderItem(orderId: string, itemId: string): Promise<OrderDto>;

  // Payment operations
  processPayment(orderId: string, paymentData: ProcessPaymentRequest): Promise<PaymentDto>;
  refundPayment(orderId: string, refundAmount?: number): Promise<PaymentDto>;
  getPaymentStatus(orderId: string): Promise<PaymentDto>;

  // Tracking and status
  getTrackingInfo(orderId: string): Promise<TrackingInfoDto>;
  updateTrackingStatus(orderId: string, status: string, location: string, description: string): Promise<TrackingInfoDto>;

  // Reporting and analytics
  getOrdersByStatus(status: string): Promise<OrderDto[]>;
  getOrdersByCustomer(customerId: string): Promise<OrderDto[]>;
  getOrdersByDateRange(dateFrom: string, dateTo: string): Promise<OrderDto[]>;
  getOrderStatistics(customerId?: string): Promise<OrderStatistics>;
  getOrderAnalytics(filters: OrderAnalyticsFilters): Promise<OrderAnalytics>;
}

// Request/Response types
export interface UpdateOrderRequest {
  notes?: string;
  shippingInstructions?: string;
}

export interface ShipOrderRequest {
  trackingNumber: string;
  carrier: string;
  estimatedDelivery?: string;
  shippingMethod?: string;
  shippingCost?: number;
}

export interface RefundOrderRequest {
  amount?: number;
  reason: string;
  refundToOriginalPayment: boolean;
}

export interface UpdateTrackingRequest {
  trackingNumber?: string;
  carrier?: string;
  status?: 'LABEL_CREATED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'EXCEPTION';
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingUrl?: string;
}

export interface UpdateOrderItemRequest {
  quantity?: number;
  unitPrice?: number;
  notes?: string;
}

export interface ProcessPaymentRequest {
  method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
  token?: string;
  amount?: number;
  currency?: string;
  details?: any;
}

export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: { [status: string]: number };
  topProducts: Array<{
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    averageOrdersPerCustomer: number;
  };
}

export interface OrderAnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  customerId?: string;
  status?: string[];
  minAmount?: number;
  maxAmount?: number;
  productIds?: string[];
  paymentMethods?: string[];
}

export interface OrderAnalytics {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  trends: {
    dailyOrders: Array<{ date: string; orders: number; revenue: number }>;
    monthlyOrders: Array<{ month: string; orders: number; revenue: number }>;
  };
  topProducts: Array<{
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
  customerInsights: {
    newVsReturning: { new: number; returning: number };
    topCustomers: Array<{ customerId: string; orders: number; totalSpent: number }>;
  };
}

/**
 * Order API Client Implementation
 * Handles all order-related API operations
 */
export class OrderApiClient extends ApiClient implements IOrderApiClient {
  private readonly basePath = '/api/orders';

  async getOrder(orderId: string): Promise<OrderDto> {
    const response = await this.get<OrderDto>(`${this.basePath}/${orderId}`);
    return response.data;
  }

  async createOrder(orderData: CreateOrderDto): Promise<OrderDto> {
    const response = await this.post<OrderDto>(this.basePath, orderData);
    return response.data;
  }

  async updateOrder(orderId: string, updates: UpdateOrderRequest): Promise<OrderDto> {
    const response = await this.put<OrderDto>(`${this.basePath}/${orderId}`, updates);
    return response.data;
  }

  async cancelOrder(orderId: string, reason: string): Promise<OrderDto> {
    const response = await this.patch<OrderDto>(`${this.basePath}/${orderId}/cancel`, { reason });
    return response.data;
  }

  async listOrders(customerId?: string): Promise<OrderDto[]> {
    const query = customerId ? `?customerId=${customerId}` : '';
    const response = await this.get<OrderDto[]>(`${this.basePath}${query}`);
    return response.data;
  }

  async searchOrders(searchParams: OrderSearchDto): Promise<OrderSearchResultDto> {
    const query = this.buildQueryString(searchParams);
    const response = await this.get<OrderSearchResultDto>(`${this.basePath}/search${query}`);
    return response.data;
  }

  async confirmOrder(orderId: string): Promise<OrderDto> {
    const response = await this.patch<OrderDto>(`${this.basePath}/${orderId}/confirm`, {});
    return response.data;
  }

  async startProcessing(orderId: string): Promise<OrderDto> {
    const response = await this.patch<OrderDto>(`${this.basePath}/${orderId}/process`, {});
    return response.data;
  }

  async shipOrder(orderId: string, shipmentData: ShipOrderRequest): Promise<OrderDto> {
    const response = await this.patch<OrderDto>(`${this.basePath}/${orderId}/ship`, shipmentData);
    return response.data;
  }

  async deliverOrder(orderId: string): Promise<OrderDto> {
    const response = await this.patch<OrderDto>(`${this.basePath}/${orderId}/deliver`, {});
    return response.data;
  }

  async refundOrder(orderId: string, refundData: RefundOrderRequest): Promise<OrderDto> {
    const response = await this.patch<OrderDto>(`${this.basePath}/${orderId}/refund`, refundData);
    return response.data;
  }

  async addNotes(orderId: string, notes: string): Promise<OrderDto> {
    const response = await this.patch<OrderDto>(`${this.basePath}/${orderId}/notes`, { notes });
    return response.data;
  }

  async updateTrackingInfo(orderId: string, trackingData: UpdateTrackingRequest): Promise<OrderDto> {
    const response = await this.patch<OrderDto>(`${this.basePath}/${orderId}/tracking`, trackingData);
    return response.data;
  }

  async updateEstimatedDelivery(orderId: string, estimatedDelivery: string): Promise<OrderDto> {
    const response = await this.patch<OrderDto>(`${this.basePath}/${orderId}/delivery-date`, {
      estimatedDelivery
    });
    return response.data;
  }

  async getOrderItems(orderId: string): Promise<OrderItemDto[]> {
    const response = await this.get<OrderItemDto[]>(`${this.basePath}/${orderId}/items`);
    return response.data;
  }

  async updateOrderItem(orderId: string, itemId: string, updates: UpdateOrderItemRequest): Promise<OrderDto> {
    const response = await this.put<OrderDto>(`${this.basePath}/${orderId}/items/${itemId}`, updates);
    return response.data;
  }

  async removeOrderItem(orderId: string, itemId: string): Promise<OrderDto> {
    const response = await this.delete<OrderDto>(`${this.basePath}/${orderId}/items/${itemId}`);
    return response.data;
  }

  async processPayment(orderId: string, paymentData: ProcessPaymentRequest): Promise<PaymentDto> {
    const response = await this.post<PaymentDto>(`${this.basePath}/${orderId}/payments`, paymentData);
    return response.data;
  }

  async refundPayment(orderId: string, refundAmount?: number): Promise<PaymentDto> {
    const response = await this.post<PaymentDto>(`${this.basePath}/${orderId}/payments/refund`, {
      amount: refundAmount
    });
    return response.data;
  }

  async getPaymentStatus(orderId: string): Promise<PaymentDto> {
    const response = await this.get<PaymentDto>(`${this.basePath}/${orderId}/payments/status`);
    return response.data;
  }

  async getTrackingInfo(orderId: string): Promise<TrackingInfoDto> {
    const response = await this.get<TrackingInfoDto>(`${this.basePath}/${orderId}/tracking`);
    return response.data;
  }

  async updateTrackingStatus(orderId: string, status: string, location: string, description: string): Promise<TrackingInfoDto> {
    const response = await this.patch<TrackingInfoDto>(`${this.basePath}/${orderId}/tracking/status`, {
      status,
      location,
      description,
      timestamp: new Date().toISOString()
    });
    return response.data;
  }

  async getOrdersByStatus(status: string): Promise<OrderDto[]> {
    const response = await this.get<OrderDto[]>(`${this.basePath}?status=${status}`);
    return response.data;
  }

  async getOrdersByCustomer(customerId: string): Promise<OrderDto[]> {
    const response = await this.get<OrderDto[]>(`${this.basePath}?customerId=${customerId}`);
    return response.data;
  }

  async getOrdersByDateRange(dateFrom: string, dateTo: string): Promise<OrderDto[]> {
    const response = await this.get<OrderDto[]>(`${this.basePath}?dateFrom=${dateFrom}&dateTo=${dateTo}`);
    return response.data;
  }

  async getOrderStatistics(customerId?: string): Promise<OrderStatistics> {
    const query = customerId ? `?customerId=${customerId}` : '';
    const response = await this.get<OrderStatistics>(`${this.basePath}/statistics${query}`);
    return response.data;
  }

  async getOrderAnalytics(filters: OrderAnalyticsFilters): Promise<OrderAnalytics> {
    const query = this.buildQueryString(filters);
    const response = await this.get<OrderAnalytics>(`${this.basePath}/analytics${query}`);
    return response.data;
  }

  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }
}

// Export singleton instance
export const orderApiClient = new OrderApiClient();
