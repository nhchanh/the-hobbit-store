/**
 * Promotion Domain Value Objects
 * Following DDD principles for type safety and validation
 */

import { Id } from '../shared/Id';
import { Money } from '../shared/Money';
import { ValidationError } from '../../errors/DomainErrors';

// Promotion ID
export class PromotionId extends Id {
  static of(value: string): PromotionId {
    return new PromotionId(value);
  }

  static generate(): PromotionId {
    return new PromotionId(Id.random().value);
  }
}

// Promotion Code
export class PromotionCode {
  private constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new ValidationError('Promotion code cannot be empty');
    }
    if (_value.length < 3 || _value.length > 20) {
      throw new ValidationError('Promotion code must be between 3 and 20 characters');
    }
    // Only allow alphanumeric and hyphens
    if (!/^[A-Z0-9\-]+$/.test(_value)) {
      throw new ValidationError('Promotion code can only contain uppercase letters, numbers, and hyphens');
    }
  }

  static of(value: string): PromotionCode {
    return new PromotionCode(value.trim().toUpperCase());
  }

  value(): string {
    return this._value;
  }

  equals(other: PromotionCode): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}

// Discount Percentage (0-100)
export class DiscountPercentage {
  private constructor(private readonly _value: number) {
    if (_value < 0 || _value > 100) {
      throw new ValidationError('Discount percentage must be between 0 and 100');
    }
  }

  static of(value: number): DiscountPercentage {
    return new DiscountPercentage(value);
  }

  value(): number {
    return this._value;
  }

  applyTo(amount: Money): Money {
    const discountAmount = amount.multiply(this._value / 100);
    return amount.subtract(discountAmount);
  }

  equals(other: DiscountPercentage): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return `${this._value}%`;
  }
}

// Fixed Discount Amount
export class FixedDiscount {
  private constructor(private readonly _amount: Money) {}

  static of(amount: Money): FixedDiscount {
    if (amount.isNegative()) {
      throw new ValidationError('Fixed discount cannot be negative');
    }
    return new FixedDiscount(amount);
  }

  amount(): Money {
    return this._amount;
  }

  applyTo(amount: Money): Money {
    return amount.subtract(this._amount);
  }

  equals(other: FixedDiscount): boolean {
    return this._amount.equals(other._amount);
  }

  toString(): string {
    return this._amount.toString();
  }
}

// Minimum Purchase Amount
export class MinimumPurchaseAmount {
  private constructor(private readonly _amount: Money) {}

  static of(amount: Money): MinimumPurchaseAmount {
    if (amount.isNegative()) {
      throw new ValidationError('Minimum purchase amount cannot be negative');
    }
    return new MinimumPurchaseAmount(amount);
  }

  amount(): Money {
    return this._amount;
  }

  isMetBy(amount: Money): boolean {
    return amount.greaterThanOrEqual(this._amount);
  }

  equals(other: MinimumPurchaseAmount): boolean {
    return this._amount.equals(other._amount);
  }

  toString(): string {
    return this._amount.toString();
  }
}

// Usage Limit
export class UsageLimit {
  private constructor(private readonly _value: number) {
    if (_value < 0) {
      throw new ValidationError('Usage limit cannot be negative');
    }
    if (!Number.isInteger(_value)) {
      throw new ValidationError('Usage limit must be an integer');
    }
  }

  static of(value: number): UsageLimit {
    return new UsageLimit(value);
  }

  static unlimited(): UsageLimit {
    return new UsageLimit(Number.MAX_SAFE_INTEGER);
  }

  value(): number {
    return this._value;
  }

  isUnlimited(): boolean {
    return this._value === Number.MAX_SAFE_INTEGER;
  }

  canBeUsed(currentUsage: number): boolean {
    return currentUsage < this._value;
  }

  equals(other: UsageLimit): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this.isUnlimited() ? 'Unlimited' : this._value.toString();
  }
}

// Promotion Status
export enum PromotionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  DISABLED = 'DISABLED',
  DELETED = 'DELETED'
}

// Promotion Type
export enum PromotionType {
  PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT',
  FIXED_AMOUNT_DISCOUNT = 'FIXED_AMOUNT_DISCOUNT',
  BUY_ONE_GET_ONE = 'BUY_ONE_GET_ONE',
  FREE_SHIPPING = 'FREE_SHIPPING',
  BUNDLE_DISCOUNT = 'BUNDLE_DISCOUNT'
}

// Promotion Validity Period
export class PromotionPeriod {
  private constructor(
    private readonly _startDate: Date,
    private readonly _endDate: Date
  ) {
    if (_startDate >= _endDate) {
      throw new ValidationError('Start date must be before end date');
    }
  }

  static of(startDate: Date, endDate: Date): PromotionPeriod {
    return new PromotionPeriod(new Date(startDate), new Date(endDate));
  }

  startDate(): Date {
    return new Date(this._startDate);
  }

  endDate(): Date {
    return new Date(this._endDate);
  }

  isActive(date: Date = new Date()): boolean {
    return date >= this._startDate && date <= this._endDate;
  }

  hasStarted(date: Date = new Date()): boolean {
    return date >= this._startDate;
  }

  hasExpired(date: Date = new Date()): boolean {
    return date > this._endDate;
  }

  durationInDays(): number {
    const diffTime = this._endDate.getTime() - this._startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  equals(other: PromotionPeriod): boolean {
    return this._startDate.getTime() === other._startDate.getTime() &&
           this._endDate.getTime() === other._endDate.getTime();
  }

  toString(): string {
    return `${this._startDate.toISOString()} - ${this._endDate.toISOString()}`;
  }
}
