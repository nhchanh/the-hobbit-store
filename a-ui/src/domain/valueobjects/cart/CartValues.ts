/**
 * Cart Domain Value Objects
 * Immutable value objects for cart-related concepts
 */

import { Id } from '../shared/Id';

// Cart ID value object
export class CartId {
  private readonly _value: Id;

  constructor(value: Id) {
    this._value = value;
  }

  get value(): Id {
    return this._value;
  }

  equals(other: CartId): boolean {
    return this._value.equals(other._value);
  }

  toString(): string {
    return this._value.toString();
  }

  static of(value: string): CartId {
    return new CartId(Id.of(value));
  }

  static random(): CartId {
    return new CartId(Id.random());
  }
}

// Cart Item ID value object
export class CartItemId {
  private readonly _value: Id;

  constructor(value: Id) {
    this._value = value;
  }

  get value(): Id {
    return this._value;
  }

  equals(other: CartItemId): boolean {
    return this._value.equals(other._value);
  }

  toString(): string {
    return this._value.toString();
  }

  static of(value: string): CartItemId {
    return new CartItemId(Id.of(value));
  }

  static random(): CartItemId {
    return new CartItemId(Id.random());
  }
}

// Quantity value object
export class Quantity {
  private readonly _value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error('Quantity must be a non-negative integer');
    }
    if (value > 999) {
      throw new Error('Quantity cannot exceed 999');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  add(other: Quantity): Quantity {
    return new Quantity(this._value + other._value);
  }

  subtract(other: Quantity): Quantity {
    const newValue = this._value - other._value;
    if (newValue < 0) {
      throw new Error('Quantity cannot be negative');
    }
    return new Quantity(newValue);
  }

  multiply(factor: number): Quantity {
    if (factor < 0) {
      throw new Error('Multiplication factor cannot be negative');
    }
    return new Quantity(Math.floor(this._value * factor));
  }

  equals(other: Quantity): boolean {
    return this._value === other._value;
  }

  isZero(): boolean {
    return this._value === 0;
  }

  isGreaterThan(other: Quantity): boolean {
    return this._value > other._value;
  }

  toString(): string {
    return this._value.toString();
  }

  static of(value: number): Quantity {
    return new Quantity(value);
  }

  static zero(): Quantity {
    return new Quantity(0);
  }

  static one(): Quantity {
    return new Quantity(1);
  }
}

// Item Price value object (extends Money concept for cart items)
export class ItemPrice {
  private readonly _amount: number;
  private readonly _currency: string;

  constructor(amount: number, currency: string = 'USD') {
    if (amount < 0) {
      throw new Error('Item price cannot be negative');
    }
    if (!Number.isFinite(amount)) {
      throw new Error('Item price must be a finite number');
    }
    if (amount > 999999.99) {
      throw new Error('Item price cannot exceed $999,999.99');
    }

    this._amount = Math.round(amount * 100) / 100; // Round to 2 decimal places
    this._currency = currency.toUpperCase();
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  multiply(quantity: Quantity): ItemPrice {
    return new ItemPrice(this._amount * quantity.value, this._currency);
  }

  add(other: ItemPrice): ItemPrice {
    if (this._currency !== other._currency) {
      throw new Error('Cannot add prices with different currencies');
    }
    return new ItemPrice(this._amount + other._amount, this._currency);
  }

  equals(other: ItemPrice): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  isZero(): boolean {
    return this._amount === 0;
  }

  formatted(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this._currency,
    }).format(this._amount);
  }

  toString(): string {
    return this.formatted();
  }

  static of(amount: number, currency?: string): ItemPrice {
    return new ItemPrice(amount, currency);
  }

  static zero(currency: string = 'USD'): ItemPrice {
    return new ItemPrice(0, currency);
  }
}

// Cart Status value object
export class CartStatus {
  private readonly _value: string;

  private static readonly VALID_STATUSES = [
    'ACTIVE',
    'INACTIVE',
    'CHECKOUT',
    'ABANDONED',
    'CONVERTED'
  ] as const;

  constructor(value: string) {
    const upperValue = value.toUpperCase();
    if (!CartStatus.VALID_STATUSES.includes(upperValue as any)) {
      throw new Error(`Invalid cart status: ${value}. Valid statuses: ${CartStatus.VALID_STATUSES.join(', ')}`);
    }
    this._value = upperValue;
  }

  get value(): string {
    return this._value;
  }

  equals(other: CartStatus): boolean {
    return this._value === other._value;
  }

  isActive(): boolean {
    return this._value === 'ACTIVE';
  }

  isInactive(): boolean {
    return this._value === 'INACTIVE';
  }

  isCheckout(): boolean {
    return this._value === 'CHECKOUT';
  }

  isAbandoned(): boolean {
    return this._value === 'ABANDONED';
  }

  isConverted(): boolean {
    return this._value === 'CONVERTED';
  }

  toString(): string {
    return this._value;
  }

  static of(value: string): CartStatus {
    return new CartStatus(value);
  }

  static active(): CartStatus {
    return new CartStatus('ACTIVE');
  }

  static inactive(): CartStatus {
    return new CartStatus('INACTIVE');
  }

  static checkout(): CartStatus {
    return new CartStatus('CHECKOUT');
  }

  static abandoned(): CartStatus {
    return new CartStatus('ABANDONED');
  }

  static converted(): CartStatus {
    return new CartStatus('CONVERTED');
  }
}
