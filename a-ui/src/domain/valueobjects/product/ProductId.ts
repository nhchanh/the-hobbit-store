/**
 * Domain: Value Object - Product ID
 * Following DDD principles - immutable identifier for Product
 */

import { ULID } from 'ulid';

export class ProductId {
  private constructor(private readonly _value: string) {
    this.validateFormat(_value);
  }

  static of(value: string): ProductId {
    return new ProductId(value);
  }

  static generate(): ProductId {
    return new ProductId(ULID());
  }

  get value(): string {
    return this._value;
  }

  equals(other: ProductId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  private validateFormat(value: string): void {
    if (!value || value.length !== 26) {
      throw new Error('ProductId must be a valid ULID (26 characters)');
    }

    // ULID format validation
    const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
    if (!ulidRegex.test(value)) {
      throw new Error('ProductId must be a valid ULID format');
    }
  }
}
