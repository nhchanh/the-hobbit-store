/**
 * Domain: Value Objects - Timestamps
 * Following DDD principles - immutable timestamp values
 */

export class CreatedAt {
  private constructor(private readonly _value: Date) {
    this.validateDate(_value);
  }

  static of(value: Date): CreatedAt {
    return new CreatedAt(new Date(value));
  }

  static now(): CreatedAt {
    return new CreatedAt(new Date());
  }

  get value(): Date {
    return new Date(this._value);
  }

  equals(other: CreatedAt): boolean {
    return this._value.getTime() === other._value.getTime();
  }

  toString(): string {
    return this._value.toISOString();
  }

  private validateDate(value: Date): void {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('CreatedAt must be a valid Date');
    }
  }
}

export class UpdatedAt {
  private constructor(private readonly _value: Date) {
    this.validateDate(_value);
  }

  static of(value: Date): UpdatedAt {
    return new UpdatedAt(new Date(value));
  }

  static now(): UpdatedAt {
    return new UpdatedAt(new Date());
  }

  get value(): Date {
    return new Date(this._value);
  }

  equals(other: UpdatedAt): boolean {
    return this._value.getTime() === other._value.getTime();
  }

  toString(): string {
    return this._value.toISOString();
  }

  private validateDate(value: Date): void {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('UpdatedAt must be a valid Date');
    }
  }
}
