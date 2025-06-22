/**
 * Domain: Value Object - Product Name
 * Following DDD principles - immutable product name
 */

export class ProductName {
  private constructor(private readonly _value: string) {
    this.validateName(_value);
  }

  static of(value: string): ProductName {
    return new ProductName(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: ProductName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  private validateName(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    if (value.length > 100) {
      throw new Error('Product name cannot exceed 100 characters');
    }
    if (value.length < 2) {
      throw new Error('Product name must be at least 2 characters');
    }
  }
}
