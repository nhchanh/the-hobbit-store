/**
 * Review Domain Value Objects
 * Following DDD principles for type safety and validation
 */

import { Id } from '../shared/Id';
import { ValidationError } from '../../errors/DomainErrors';

// Review ID
export class ReviewId extends Id {
  static of(value: string): ReviewId {
    return new ReviewId(value);
  }

  static generate(): ReviewId {
    return new ReviewId(Id.random().value);
  }
}

// Rating value object (1-5 stars)
export class Rating {
  private constructor(private readonly _value: number) {
    if (_value < 1 || _value > 5) {
      throw new ValidationError('Rating must be between 1 and 5');
    }
  }

  static of(value: number): Rating {
    return new Rating(value);
  }

  value(): number {
    return this._value;
  }

  equals(other: Rating): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString();
  }
}

// Review Comment
export class ReviewComment {
  private constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new ValidationError('Review comment cannot be empty');
    }
    if (_value.length > 2000) {
      throw new ValidationError('Review comment cannot exceed 2000 characters');
    }
  }

  static of(value: string): ReviewComment {
    return new ReviewComment(value.trim());
  }

  value(): string {
    return this._value;
  }

  equals(other: ReviewComment): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}

// Review Title
export class ReviewTitle {
  private constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new ValidationError('Review title cannot be empty');
    }
    if (_value.length > 200) {
      throw new ValidationError('Review title cannot exceed 200 characters');
    }
  }

  static of(value: string): ReviewTitle {
    return new ReviewTitle(value.trim());
  }

  value(): string {
    return this._value;
  }

  equals(other: ReviewTitle): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}

// Review Status
export enum ReviewStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  HIDDEN = 'HIDDEN',
  FLAGGED = 'FLAGGED'
}

// Review Verification Status
export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED_PURCHASE = 'VERIFIED_PURCHASE',
  VERIFIED_REVIEWER = 'VERIFIED_REVIEWER'
}

// Review Helpfulness Count
export class HelpfulnessCount {
  private constructor(private readonly _value: number) {
    if (_value < 0) {
      throw new ValidationError('Helpfulness count cannot be negative');
    }
  }

  static of(value: number): HelpfulnessCount {
    return new HelpfulnessCount(value);
  }

  static zero(): HelpfulnessCount {
    return new HelpfulnessCount(0);
  }

  value(): number {
    return this._value;
  }

  increment(): HelpfulnessCount {
    return new HelpfulnessCount(this._value + 1);
  }

  decrement(): HelpfulnessCount {
    return new HelpfulnessCount(Math.max(0, this._value - 1));
  }

  equals(other: HelpfulnessCount): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString();
  }
}
