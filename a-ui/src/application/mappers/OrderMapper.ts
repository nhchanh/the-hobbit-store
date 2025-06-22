import { Order, OrderId } from '../../domain/aggregates/order/Order';
import { CustomerId } from '../../domain/valueobjects/customer/CustomerValues';
import { Id } from '../../domain/valueobjects/shared/Id';
import { Money } from '../../domain/valueobjects/shared/Money';
import { CreatedAt, UpdatedAt } from '../../domain/valueobjects/shared/Timestamps';
import {
  OrderDto,
  OrderItemDto,
  BillingInfoDto,
  ShippingInfoDto,
  PaymentDto,
  OrderTotalsDto,
  TrackingInfoDto
} from '../dto/OrderDto';

export class OrderMapper {
  static toDto(order: Order): OrderDto {
    return {
      id: order.id.value.value,
      customerId: order.customerId.value.value,
      status: order.status,
      items: order.items.map(this.orderItemToDto),
      billing: this.billingInfoToDto(order.billingAddress),
      shipping: this.shippingInfoToDto(order.shippingAddress),
      payment: this.paymentToDto(order.paymentInfo, order.id.value.value),
      totals: this.totalsToDto(order),
      notes: order.notes,
      tracking: order.trackingNumber ? this.trackingToDto(order) : undefined,
      createdAt: order.createdAt.value.toISOString(),
      updatedAt: order.updatedAt.value.toISOString()
    };
  }

  static toDomain(dto: OrderDto): Order {
    const orderId = OrderId.of(dto.id);
    const customerId = new CustomerId(Id.of(dto.customerId));

    const items = dto.items.map(this.orderItemToDomain);
    const shippingAddress = this.shippingInfoToDomain(dto.shipping);
    const billingAddress = this.billingInfoToDomain(dto.billing);
    const paymentInfo = this.paymentToDomain(dto.payment);

    const subtotal = Money.of(dto.totals.subtotal);
    const discountAmount = Money.of(dto.totals.discountAmount);
    const taxAmount = Money.of(dto.totals.taxAmount);
    const shippingAmount = Money.of(dto.totals.shippingCost);
    const totalAmount = Money.of(dto.totals.total);

    const trackingNumber = dto.tracking?.trackingNumber;
    const estimatedDeliveryDate = dto.tracking?.estimatedDelivery ? new Date(dto.tracking.estimatedDelivery) : undefined;
    const actualDeliveryDate = dto.tracking?.actualDelivery ? new Date(dto.tracking.actualDelivery) : undefined;

    return Order.reconstitute(
      orderId,
      customerId,
      dto.id, // Using ID as order number for now
      dto.status,
      items,
      shippingAddress,
      billingAddress,
      paymentInfo,
      subtotal,
      discountAmount,
      taxAmount,
      shippingAmount,
      totalAmount,
      undefined, // promotionCode - not in current DTO
      trackingNumber,
      estimatedDeliveryDate,
      actualDeliveryDate,
      dto.notes,
      CreatedAt.of(new Date(dto.createdAt)),
      UpdatedAt.of(new Date(dto.updatedAt))
    );
  }

  private static orderItemToDto(item: any): OrderItemDto {
    return {
      id: item.id,
      orderId: item.orderId.value.value,
      productId: item.productId.value,
      productName: item.productName,
      productPrice: item.unitPrice.amount,
      quantity: item.quantity,
      itemPrice: item.totalPrice.amount,
      imageUrl: undefined, // Not available in domain model
      status: 'PENDING' // Default status
    };
  }

  private static orderItemToDomain(dto: OrderItemDto): any {
    return {
      id: dto.id,
      orderId: OrderId.of(dto.orderId),
      productId: Id.of(dto.productId),
      productName: dto.productName,
      quantity: dto.quantity,
      unitPrice: Money.of(dto.productPrice),
      totalPrice: Money.of(dto.itemPrice),
      discountAmount: Money.zero(),
      taxAmount: Money.zero()
    };
  }

  private static billingInfoToDto(address: any): BillingInfoDto {
    return {
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company,
      address: {
        id: 'billing',
        customerId: '',
        type: 'BILLING' as const,
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company,
        streetLine1: address.streetLine1,
        streetLine2: address.streetLine2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        phoneNumber: address.phoneNumber,
        isDefault: false
      },
      email: '', // Not available in domain model
      phoneNumber: address.phoneNumber
    };
  }

  private static billingInfoToDomain(dto: BillingInfoDto): any {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      company: dto.company,
      streetLine1: dto.address.streetLine1,
      streetLine2: dto.address.streetLine2,
      city: dto.address.city,
      state: dto.address.state,
      postalCode: dto.address.postalCode,
      country: dto.address.country,
      phoneNumber: dto.phoneNumber
    };
  }

  private static shippingInfoToDto(address: any): ShippingInfoDto {
    return {
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company,
      address: {
        id: 'shipping',
        customerId: '',
        type: 'SHIPPING' as const,
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company,
        streetLine1: address.streetLine1,
        streetLine2: address.streetLine2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        phoneNumber: address.phoneNumber,
        isDefault: false
      },
      phoneNumber: address.phoneNumber,
      method: {
        id: 'standard',
        name: 'Standard Shipping',
        description: 'Standard delivery',
        price: 9.99,
        estimatedDays: 5,
        trackingSupported: true
      },
      instructions: undefined
    };
  }

  private static shippingInfoToDomain(dto: ShippingInfoDto): any {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      company: dto.company,
      streetLine1: dto.address.streetLine1,
      streetLine2: dto.address.streetLine2,
      city: dto.address.city,
      state: dto.address.state,
      postalCode: dto.address.postalCode,
      country: dto.address.country,
      phoneNumber: dto.phoneNumber
    };
  }

  private static paymentToDto(paymentInfo: any, orderId: string): PaymentDto {
    return {
      id: `payment_${orderId}`,
      orderId: orderId,
      method: paymentInfo.method,
      status: paymentInfo.status,
      amount: 0, // Would need total amount from order
      currency: 'USD',
      transactionId: paymentInfo.transactionId,
      gateway: undefined,
      processingFee: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private static paymentToDomain(dto: PaymentDto): any {
    return {
      method: dto.method,
      transactionId: dto.transactionId,
      cardLast4: undefined,
      cardBrand: undefined,
      status: dto.status,
      paidAt: dto.status === 'COMPLETED' ? new Date() : undefined,
      refundedAt: dto.status === 'REFUNDED' ? new Date() : undefined,
      refundAmount: undefined
    };
  }

  private static totalsToDto(order: Order): OrderTotalsDto {
    return {
      subtotal: order.subtotal.amount,
      shippingCost: order.shippingAmount.amount,
      taxAmount: order.taxAmount.amount,
      discountAmount: order.discountAmount.amount,
      total: order.totalAmount.amount,
      currency: 'USD'
    };
  }

  private static trackingToDto(order: Order): TrackingInfoDto {
    return {
      trackingNumber: order.trackingNumber!,
      carrier: 'FedEx',
      status: order.isDelivered ? 'DELIVERED' : 'IN_TRANSIT',
      estimatedDelivery: order.estimatedDeliveryDate?.toISOString(),
      actualDelivery: order.actualDeliveryDate?.toISOString(),
      trackingUrl: `https://tracking.fedex.com/${order.trackingNumber}`,
      updates: []
    };
  }
}
