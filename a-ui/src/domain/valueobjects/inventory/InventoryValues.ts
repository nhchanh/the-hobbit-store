/**
 * Inventory Domain Value Objects
 * Following DDD principles for type safety and validation
 */

import { Id } from '../shared/Id';
import { ValidationError } from '../../errors/DomainErrors';

// Stock Quantity
export class StockQuantity {
  private constructor(private readonly _value: number) {
    if (_value < 0) {
      throw new ValidationError('Stock quantity cannot be negative');
    }
    if (!Number.isInteger(_value)) {
      throw new ValidationError('Stock quantity must be an integer');
    }
  }

  static of(value: number): StockQuantity {
    return new StockQuantity(value);
  }

  static zero(): StockQuantity {
    return new StockQuantity(0);
  }

  value(): number {
    return this._value;
  }

  add(quantity: number): StockQuantity {
    return new StockQuantity(this._value + quantity);
  }

  subtract(quantity: number): StockQuantity {
    const newValue = this._value - quantity;
    if (newValue < 0) {
      throw new ValidationError('Insufficient stock quantity');
    }
    return new StockQuantity(newValue);
  }

  isLowStock(threshold: RestockThreshold): boolean {
    return this._value <= threshold.value();
  }

  isEmpty(): boolean {
    return this._value === 0;
  }

  equals(other: StockQuantity): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString();
  }
}

// Restock Threshold
export class RestockThreshold {
  private constructor(private readonly _value: number) {
    if (_value < 0) {
      throw new ValidationError('Restock threshold cannot be negative');
    }
    if (!Number.isInteger(_value)) {
      throw new ValidationError('Restock threshold must be an integer');
    }
  }

  static of(value: number): RestockThreshold {
    return new RestockThreshold(value);
  }

  static default(): RestockThreshold {
    return new RestockThreshold(10);
  }

  value(): number {
    return this._value;
  }

  equals(other: RestockThreshold): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString();
  }
}

// Last Restocked Date
export class LastRestocked {
  private constructor(private readonly _value: Date) {}

  static of(date: Date): LastRestocked {
    return new LastRestocked(new Date(date));
  }

  static now(): LastRestocked {
    return new LastRestocked(new Date());
  }

  value(): Date {
    return new Date(this._value);
  }

  isOlderThan(days: number): boolean {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - days);
    return this._value < threshold;
  }

  equals(other: LastRestocked): boolean {
    return this._value.getTime() === other._value.getTime();
  }

  toString(): string {
    return this._value.toISOString();
  }
}

// Inventory Status
export enum InventoryStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED'
}

// Location Code (warehouse/shelf location)
export class LocationCode {
  private constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new ValidationError('Location code cannot be empty');
    }
    if (_value.length > 50) {
      throw new ValidationError('Location code cannot exceed 50 characters');
    }
    // Format: WAREHOUSE-SECTION-SHELF (e.g., WH1-A-001)
    if (!/^[A-Z0-9\-]+$/.test(_value)) {
      throw new ValidationError('Location code can only contain uppercase letters, numbers, and hyphens');
    }
  }

  static of(value: string): LocationCode {
    return new LocationCode(value.trim().toUpperCase());
  }

  value(): string {
    return this._value;
  }

  equals(other: LocationCode): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
