/**
 * Domain: Value Object - Cart ID
 * Following DDD principles - immutable identifier for Cart aggregate
 */

import { ULID } from 'ulid';

export class CartId {
  private constructor(private readonly _value: string) {
    this.validateFormat(_value);
  }

  static of(value: string): CartId {
    return new CartId(value);
  }

  static generate(): CartId {
    return new CartId(ULID());
  }

  get value(): string {
    return this._value;
  }

  equals(other: CartId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  private validateFormat(value: string): void {
    if (!value || value.length !== 26) {
      throw new Error('CartId must be a valid ULID (26 characters)');
    }

    // ULID format validation
    const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
    if (!ulidRegex.test(value)) {
      throw new Error('CartId must be a valid ULID format');
    }
  }
}
