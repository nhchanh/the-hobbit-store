/**
 * Domain: Value Object - Product Description
 * Following DDD principles - immutable product description
 */

export class ProductDescription {
  private constructor(private readonly _value: string) {
    this.validateDescription(_value);
  }

  static of(value: string): ProductDescription {
    return new ProductDescription(value);
  }

  static empty(): ProductDescription {
    return new ProductDescription('');
  }

  get value(): string {
    return this._value;
  }

  equals(other: ProductDescription): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  isEmpty(): boolean {
    return this._value.trim().length === 0;
  }

  private validateDescription(value: string): void {
    if (value && value.length > 1000) {
      throw new Error('Product description cannot exceed 1000 characters');
    }
  }
}
