/**
 * Product Domain Value Objects
 * Immutable value objects for product-related concepts
 */

import { Id } from '../shared/Id';

// Product ID value object
export class ProductId {
  private readonly _value: Id;

  constructor(value: Id) {
    this._value = value;
  }

  get value(): Id {
    return this._value;
  }

  equals(other: ProductId): boolean {
    return this._value.equals(other._value);
  }

  toString(): string {
    return this._value.toString();
  }

  static of(value: string): ProductId {
    return new ProductId(Id.of(value));
  }

  static random(): ProductId {
    return new ProductId(Id.random());
  }
}

// Category ID value object
export class CategoryId {
  private readonly _value: Id;

  constructor(value: Id) {
    this._value = value;
  }

  get value(): Id {
    return this._value;
  }

  equals(other: CategoryId): boolean {
    return this._value.equals(other._value);
  }

  toString(): string {
    return this._value.toString();
  }

  static of(value: string): CategoryId {
    return new CategoryId(Id.of(value));
  }

  static random(): CategoryId {
    return new CategoryId(Id.random());
  }
}

// Product Name value object
export class ProductName {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    if (value.length > 255) {
      throw new Error('Product name cannot exceed 255 characters');
    }
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  get length(): number {
    return this._value.length;
  }

  contains(searchTerm: string): boolean {
    return this._value.toLowerCase().includes(searchTerm.toLowerCase());
  }

  equals(other: ProductName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static of(value: string): ProductName {
    return new ProductName(value);
  }
}

// Product Description value object
export class ProductDescription {
  private readonly _value: string;

  constructor(value: string) {
    if (value && value.length > 2000) {
      throw new Error('Product description cannot exceed 2000 characters');
    }
    this._value = value?.trim() || '';
  }

  get value(): string {
    return this._value;
  }

  get length(): number {
    return this._value.length;
  }

  get isEmpty(): boolean {
    return this._value.length === 0;
  }

  get wordCount(): number {
    if (this._value.length === 0) return 0;
    return this._value.split(/\s+/).length;
  }

  contains(searchTerm: string): boolean {
    return this._value.toLowerCase().includes(searchTerm.toLowerCase());
  }

  preview(maxLength: number = 100): string {
    if (this._value.length <= maxLength) {
      return this._value;
    }
    return this._value.substring(0, maxLength).trim() + '...';
  }

  equals(other: ProductDescription): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static of(value: string): ProductDescription {
    return new ProductDescription(value);
  }

  static empty(): ProductDescription {
    return new ProductDescription('');
  }
}

// Product Price value object
export class ProductPrice {
  private readonly _amount: number;
  private readonly _currency: string;

  constructor(amount: number, currency: string = 'USD') {
    if (amount < 0) {
      throw new Error('Product price cannot be negative');
    }
    if (!Number.isFinite(amount)) {
      throw new Error('Product price must be a finite number');
    }
    if (amount > 999999.99) {
      throw new Error('Product price cannot exceed $999,999.99');
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

  applyDiscount(percentage: number): ProductPrice {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }
    const discountAmount = this._amount * (percentage / 100);
    return new ProductPrice(this._amount - discountAmount, this._currency);
  }

  add(other: ProductPrice): ProductPrice {
    if (this._currency !== other._currency) {
      throw new Error('Cannot add prices with different currencies');
    }
    return new ProductPrice(this._amount + other._amount, this._currency);
  }

  multiply(factor: number): ProductPrice {
    if (factor < 0) {
      throw new Error('Multiplication factor cannot be negative');
    }
    return new ProductPrice(this._amount * factor, this._currency);
  }

  equals(other: ProductPrice): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  isZero(): boolean {
    return this._amount === 0;
  }

  isGreaterThan(other: ProductPrice): boolean {
    if (this._currency !== other._currency) {
      throw new Error('Cannot compare prices with different currencies');
    }
    return this._amount > other._amount;
  }

  isLessThan(other: ProductPrice): boolean {
    if (this._currency !== other._currency) {
      throw new Error('Cannot compare prices with different currencies');
    }
    return this._amount < other._amount;
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

  static of(amount: number, currency?: string): ProductPrice {
    return new ProductPrice(amount, currency);
  }

  static zero(currency: string = 'USD'): ProductPrice {
    return new ProductPrice(0, currency);
  }
}

// Product Rating value object
export class ProductRating {
  private readonly _value: number;

  constructor(value: number) {
    if (!Number.isFinite(value)) {
      throw new Error('Product rating must be a finite number');
    }
    if (value < 0 || value > 5) {
      throw new Error('Product rating must be between 0 and 5');
    }

    this._value = Math.round(value * 10) / 10; // Round to 1 decimal place
  }

  get value(): number {
    return this._value;
  }

  get stars(): number {
    return Math.round(this._value);
  }

  get isExcellent(): boolean {
    return this._value >= 4.5;
  }

  get isGood(): boolean {
    return this._value >= 3.5 && this._value < 4.5;
  }

  get isFair(): boolean {
    return this._value >= 2.5 && this._value < 3.5;
  }

  get isPoor(): boolean {
    return this._value < 2.5;
  }

  equals(other: ProductRating): boolean {
    return this._value === other._value;
  }

  isGreaterThan(other: ProductRating): boolean {
    return this._value > other._value;
  }

  isLessThan(other: ProductRating): boolean {
    return this._value < other._value;
  }

  toString(): string {
    return this._value.toFixed(1);
  }

  formatted(): string {
    return `${this._value.toFixed(1)}/5.0`;
  }

  static of(value: number): ProductRating {
    return new ProductRating(value);
  }

  static zero(): ProductRating {
    return new ProductRating(0);
  }

  static max(): ProductRating {
    return new ProductRating(5);
  }
}

// Stock Quantity value object
export class StockQuantity {
  private readonly _value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error('Stock quantity must be a non-negative integer');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  add(quantity: number): StockQuantity {
    return new StockQuantity(this._value + quantity);
  }

  subtract(quantity: number): StockQuantity {
    const newValue = this._value - quantity;
    if (newValue < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
    return new StockQuantity(newValue);
  }

  equals(other: StockQuantity): boolean {
    return this._value === other._value;
  }

  isZero(): boolean {
    return this._value === 0;
  }

  isInStock(): boolean {
    return this._value > 0;
  }

  isLowStock(threshold: number = 10): boolean {
    return this._value > 0 && this._value <= threshold;
  }

  isOutOfStock(): boolean {
    return this._value === 0;
  }

  isGreaterThan(other: StockQuantity): boolean {
    return this._value > other._value;
  }

  toString(): string {
    return this._value.toString();
  }

  static of(value: number): StockQuantity {
    return new StockQuantity(value);
  }

  static zero(): StockQuantity {
    return new StockQuantity(0);
  }
}
