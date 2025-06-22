/**
 * Order Aggregate Root
 * Following DDD principles - main aggregate for order management
 */

import { Id } from '../../valueobjects/shared/Id';
import { CustomerId } from '../../valueobjects/customer/CustomerValues';
import { Money } from '../../valueobjects/shared/Money';
import { CreatedAt, UpdatedAt } from '../../valueobjects/shared/Timestamps';
import { OrderDomainError } from '../../errors/DomainErrors';

// Order ID value object
export class OrderId {
  private readonly _value: Id;

  constructor(value: Id) {
    this._value = value;
  }

  get value(): Id {
    return this._value;
  }

  equals(other: OrderId): boolean {
    return this._value.equals(other._value);
  }

  toString(): string {
    return this._value.toString();
  }

  static of(value: string): OrderId {
    return new OrderId(Id.of(value));
  }

  static random(): OrderId {
    return new OrderId(Id.random());
  }
}

// Order Item entity within the aggregate
export interface OrderItem {
  id: string;
  orderId: OrderId;
  productId: Id;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: Money;
  totalPrice: Money;
  discountAmount: Money;
  taxAmount: Money;
}

// Order Address value object
export interface OrderAddress {
  firstName: string;
  lastName: string;
  company?: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

// Payment Information value object
export interface PaymentInfo {
  method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
  transactionId?: string;
  cardLast4?: string;
  cardBrand?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paidAt?: Date;
  refundedAt?: Date;
  refundAmount?: Money;
}

// Order Status enum
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export class Order {
  private constructor(
    private readonly _id: OrderId,
    private readonly _customerId: CustomerId,
    private readonly _orderNumber: string,
    private _status: OrderStatus,
    private readonly _items: OrderItem[],
    private readonly _shippingAddress: OrderAddress,
    private readonly _billingAddress: OrderAddress,
    private readonly _paymentInfo: PaymentInfo,
    private readonly _subtotal: Money,
    private readonly _discountAmount: Money,
    private readonly _taxAmount: Money,
    private readonly _shippingAmount: Money,
    private readonly _totalAmount: Money,
    private _promotionCode: string | undefined,
    private _trackingNumber: string | undefined,
    private _estimatedDeliveryDate: Date | undefined,
    private _actualDeliveryDate: Date | undefined,
    private _notes: string | undefined,
    private readonly _createdAt: CreatedAt,
    private _updatedAt: UpdatedAt,
  ) {}

  // Factory method for creating new order
  static create(
    customerId: CustomerId,
    items: Omit<OrderItem, 'id' | 'orderId'>[],
    shippingAddress: OrderAddress,
    billingAddress: OrderAddress,
    paymentInfo: Omit<PaymentInfo, 'status' | 'paidAt'>,
    promotionCode?: string
  ): Order {
    const now = new Date();
    const orderId = OrderId.random();
    const orderNumber = Order.generateOrderNumber();

    // Calculate totals
    const subtotal = items.reduce((sum, item) =>
      sum.add(item.totalPrice), Money.zero()
    );

    const discountAmount = Money.zero(); // Would be calculated based on promotion
    const taxAmount = subtotal.multiply(0.08); // 8% tax rate
    const shippingAmount = Money.of(9.99); // Fixed shipping
    const totalAmount = subtotal
      .subtract(discountAmount)
      .add(taxAmount)
      .add(shippingAmount);

    // Create order items with IDs
    const orderItems: OrderItem[] = items.map((item, index) => ({
      ...item,
      id: `item_${index + 1}`,
      orderId: orderId,
    }));

    return new Order(
      orderId,
      customerId,
      orderNumber,
      'PENDING',
      orderItems,
      shippingAddress,
      billingAddress,
      { ...paymentInfo, status: 'PENDING' },
      subtotal,
      discountAmount,
      taxAmount,
      shippingAmount,
      totalAmount,
      promotionCode,
      undefined,
      undefined,
      undefined,
      undefined,
      CreatedAt.of(now),
      UpdatedAt.of(now),
    );
  }

  // Factory method for reconstituting from persistence
  static reconstitute(
    id: OrderId,
    customerId: CustomerId,
    orderNumber: string,
    status: OrderStatus,
    items: OrderItem[],
    shippingAddress: OrderAddress,
    billingAddress: OrderAddress,
    paymentInfo: PaymentInfo,
    subtotal: Money,
    discountAmount: Money,
    taxAmount: Money,
    shippingAmount: Money,
    totalAmount: Money,
    promotionCode: string | undefined,
    trackingNumber: string | undefined,
    estimatedDeliveryDate: Date | undefined,
    actualDeliveryDate: Date | undefined,
    notes: string | undefined,
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
  ): Order {
    return new Order(
      id,
      customerId,
      orderNumber,
      status,
      items,
      shippingAddress,
      billingAddress,
      paymentInfo,
      subtotal,
      discountAmount,
      taxAmount,
      shippingAmount,
      totalAmount,
      promotionCode,
      trackingNumber,
      estimatedDeliveryDate,
      actualDeliveryDate,
      notes,
      createdAt,
      updatedAt,
    );
  }

  // Business logic: Confirm order
  confirm(): void {
    if (this._status !== 'PENDING') {
      throw new OrderDomainError('Only pending orders can be confirmed');
    }

    this._status = 'CONFIRMED';
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Start processing
  startProcessing(): void {
    if (this._status !== 'CONFIRMED') {
      throw new OrderDomainError('Only confirmed orders can be processed');
    }

    this._status = 'PROCESSING';
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Ship order
  ship(trackingNumber: string, estimatedDeliveryDate?: Date): void {
    if (this._status !== 'PROCESSING') {
      throw new OrderDomainError('Only processing orders can be shipped');
    }

    this._status = 'SHIPPED';
    this._trackingNumber = trackingNumber;
    this._estimatedDeliveryDate = estimatedDeliveryDate;
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Mark as delivered
  deliver(): void {
    if (this._status !== 'SHIPPED') {
      throw new OrderDomainError('Only shipped orders can be delivered');
    }

    this._status = 'DELIVERED';
    this._actualDeliveryDate = new Date();
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Cancel order
  cancel(): void {
    if (['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(this._status)) {
      throw new OrderDomainError('Cannot cancel delivered, cancelled, or refunded orders');
    }

    this._status = 'CANCELLED';
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Refund order
  refund(refundAmount?: Money): void {
    if (this._status !== 'DELIVERED') {
      throw new OrderDomainError('Only delivered orders can be refunded');
    }

    this._status = 'REFUNDED';

    // Update payment info with refund details
    (this._paymentInfo as any).status = 'REFUNDED';
    (this._paymentInfo as any).refundedAt = new Date();
    (this._paymentInfo as any).refundAmount = refundAmount || this._totalAmount;

    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Add notes
  addNotes(notes: string): void {
    this._notes = notes;
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Update estimated delivery date
  updateEstimatedDeliveryDate(date: Date): void {
    if (this._status !== 'SHIPPED') {
      throw new OrderDomainError('Can only update delivery date for shipped orders');
    }

    this._estimatedDeliveryDate = date;
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Helper methods
  private static generateOrderNumber(): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `ORD-${year}${month}${day}-${random}`;
  }

  // Getters (immutable access)
  get id(): OrderId { return this._id; }
  get customerId(): CustomerId { return this._customerId; }
  get orderNumber(): string { return this._orderNumber; }
  get status(): OrderStatus { return this._status; }
  get items(): readonly OrderItem[] { return Object.freeze([...this._items]); }
  get shippingAddress(): OrderAddress { return { ...this._shippingAddress }; }
  get billingAddress(): OrderAddress { return { ...this._billingAddress }; }
  get paymentInfo(): PaymentInfo { return { ...this._paymentInfo }; }
  get subtotal(): Money { return this._subtotal; }
  get discountAmount(): Money { return this._discountAmount; }
  get taxAmount(): Money { return this._taxAmount; }
  get shippingAmount(): Money { return this._shippingAmount; }
  get totalAmount(): Money { return this._totalAmount; }
  get promotionCode(): string | undefined { return this._promotionCode; }
  get trackingNumber(): string | undefined { return this._trackingNumber; }
  get estimatedDeliveryDate(): Date | undefined { return this._estimatedDeliveryDate; }
  get actualDeliveryDate(): Date | undefined { return this._actualDeliveryDate; }
  get notes(): string | undefined { return this._notes; }
  get createdAt(): CreatedAt { return this._createdAt; }
  get updatedAt(): UpdatedAt { return this._updatedAt; }
  get itemCount(): number { return this._items.length; }
  get totalQuantity(): number {
    return this._items.reduce((sum, item) => sum + item.quantity, 0);
  }
  get isPending(): boolean { return this._status === 'PENDING'; }
  get isConfirmed(): boolean { return this._status === 'CONFIRMED'; }
  get isProcessing(): boolean { return this._status === 'PROCESSING'; }
  get isShipped(): boolean { return this._status === 'SHIPPED'; }
  get isDelivered(): boolean { return this._status === 'DELIVERED'; }
  get isCancelled(): boolean { return this._status === 'CANCELLED'; }
  get isRefunded(): boolean { return this._status === 'REFUNDED'; }
  get canBeCancelled(): boolean {
    return !['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(this._status);
  }
  get canBeRefunded(): boolean { return this._status === 'DELIVERED'; }
  get hasTracking(): boolean { return !!this._trackingNumber; }
}
