/**
 * Domain: Value Object - Category ID
 * Following DDD principles - immutable identifier for Category
 */

import { ULID } from 'ulid';

export class CategoryId {
  private constructor(private readonly _value: string) {
    this.validateFormat(_value);
  }

  static of(value: string): CategoryId {
    return new CategoryId(value);
  }

  static generate(): CategoryId {
    return new CategoryId(ULID());
  }

  get value(): string {
    return this._value;
  }

  equals(other: CategoryId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  private validateFormat(value: string): void {
    if (!value || value.length !== 26) {
      throw new Error('CategoryId must be a valid ULID (26 characters)');
    }

    // ULID format validation
    const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
    if (!ulidRegex.test(value)) {
      throw new Error('CategoryId must be a valid ULID format');
    }
  }
}
