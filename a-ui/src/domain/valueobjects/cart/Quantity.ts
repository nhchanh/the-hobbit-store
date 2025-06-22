/**
 * Domain: Value Object - Quantity
 * Following DDD principles - immutable quantity value for cart items
 */

export class Quantity {
  private constructor(private readonly _value: number) {
    this.validateQuantity(_value);
  }

  static of(value: number): Quantity {
    return new Quantity(value);
  }

  static zero(): Quantity {
    return new Quantity(0);
  }

  get value(): number {
    return this._value;
  }

  add(other: Quantity): Quantity {
    return new Quantity(this._value + other._value);
  }

  subtract(other: Quantity): Quantity {
    return new Quantity(this._value - other._value);
  }

  multiply(factor: number): Quantity {
    return new Quantity(this._value * factor);
  }

  isZero(): boolean {
    return this._value === 0;
  }

  isPositive(): boolean {
    return this._value > 0;
  }

  equals(other: Quantity): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString();
  }

  private validateQuantity(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error('Quantity must be an integer');
    }
    if (value < 0) {
      throw new Error('Quantity cannot be negative');
    }
    if (value > 1000) {
      throw new Error('Quantity cannot exceed 1000');
    }
  }
}
