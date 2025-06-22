/**
 * Shared Domain Value Objects
 * Core value objects used across multiple aggregates
 */

// Base ID type - mirrors backend ULID
export class Id {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.length !== 26) {
      throw new Error('Invalid ULID: must be 26 characters');
    }
    if (!/^[0-9A-Z]{26}$/.test(value)) {
      throw new Error('Invalid ULID: must be uppercase alphanumeric');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  equals(other: Id): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static of(value: string): Id {
    return new Id(value);
  }

  static random(): Id {
    // Simple ULID generator for demo - in real app would use proper ULID library
    const chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    let result = '';
    for (let i = 0; i < 26; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return new Id(result);
  }
}

// Re-export from dedicated files
export { Email } from './Email';
export { PhoneNumber } from './PhoneNumber';
export { Address } from './Address';

// Environment ID value object
export class EnvironmentId {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.length < 5 || value.length > 10) {
      throw new Error('Environment ID must be 5-10 characters');
    }
    if (!/^[A-Z0-9]+$/.test(value)) {
      throw new Error('Environment ID must be uppercase alphanumeric');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  equals(other: EnvironmentId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static of(value: string): EnvironmentId {
    return new EnvironmentId(value);
  }

  static dev(): EnvironmentId {
    return new EnvironmentId('DEV');
  }

  static test(): EnvironmentId {
    return new EnvironmentId('TEST');
  }

  static prod(): EnvironmentId {
    return new EnvironmentId('PROD');
  }
}
