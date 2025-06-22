/**
 * Domain: Value Object - Customer ID
 * Following DDD principles - immutable identifier for Customer
 */

import { ULID } from 'ulid';

export class CustomerId {
  private constructor(private readonly _value: string) {
    this.validateFormat(_value);
  }

  static of(value: string): CustomerId {
    return new CustomerId(value);
  }

  static generate(): CustomerId {
    return new CustomerId(ULID());
  }

  get value(): string {
    return this._value;
  }

  equals(other: CustomerId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  private validateFormat(value: string): void {
    if (!value || value.length !== 26) {
      throw new Error('CustomerId must be a valid ULID (26 characters)');
    }

    // ULID format validation
    const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
    if (!ulidRegex.test(value)) {
      throw new Error('CustomerId must be a valid ULID format');
    }
  }
}
