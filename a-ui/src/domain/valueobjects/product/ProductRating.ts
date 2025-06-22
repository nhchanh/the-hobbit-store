/**
 * Domain: Value Object - Product Rating
 * Following DDD principles - immutable product rating
 */

export class ProductRating {
  private constructor(
    private readonly _value: number,
    private readonly _reviewCount: number = 0,
  ) {
    this.validateRating(_value);
    this.validateReviewCount(_reviewCount);
  }

  static of(value: number, reviewCount: number = 0): ProductRating {
    return new ProductRating(value, reviewCount);
  }

  static unrated(): ProductRating {
    return new ProductRating(0, 0);
  }

  get value(): number {
    return this._value;
  }

  get reviewCount(): number {
    return this._reviewCount;
  }

  hasRating(): boolean {
    return this._reviewCount > 0;
  }

  equals(other: ProductRating): boolean {
    return this._value === other._value && this._reviewCount === other._reviewCount;
  }

  toString(): string {
    if (!this.hasRating()) {
      return 'No rating';
    }
    return `${this._value.toFixed(1)} (${this._reviewCount} review${this._reviewCount === 1 ? '' : 's'})`;
  }

  private validateRating(value: number): void {
    if (value < 0 || value > 5) {
      throw new Error('Product rating must be between 0 and 5');
    }
    if (!Number.isFinite(value)) {
      throw new Error('Product rating must be a finite number');
    }
  }

  private validateReviewCount(reviewCount: number): void {
    if (reviewCount < 0) {
      throw new Error('Review count cannot be negative');
    }
    if (!Number.isInteger(reviewCount)) {
      throw new Error('Review count must be an integer');
    }
  }
}
