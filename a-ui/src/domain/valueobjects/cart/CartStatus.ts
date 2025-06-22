/**
 * Domain: Value Object - Cart Status
 * Following DDD principles - immutable status for Cart
 */

export enum CartStatusEnum {
  ACTIVE = 'ACTIVE',
  ABANDONED = 'ABANDONED',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

export class CartStatus {
  private constructor(private readonly _value: CartStatusEnum) {}

  static active(): CartStatus {
    return new CartStatus(CartStatusEnum.ACTIVE);
  }

  static abandoned(): CartStatus {
    return new CartStatus(CartStatusEnum.ABANDONED);
  }

  static completed(): CartStatus {
    return new CartStatus(CartStatusEnum.COMPLETED);
  }

  static expired(): CartStatus {
    return new CartStatus(CartStatusEnum.EXPIRED);
  }

  static of(value: string): CartStatus {
    const enumValue = (Object.values(CartStatusEnum) as string[]).find(
      (status: string) => status === value.toUpperCase()
    ) as CartStatusEnum;

    if (!enumValue) {
      throw new Error(`Invalid cart status: ${value}`);
    }

    return new CartStatus(enumValue);
  }

  get value(): CartStatusEnum {
    return this._value;
  }

  isActive(): boolean {
    return this._value === CartStatusEnum.ACTIVE;
  }

  isCompleted(): boolean {
    return this._value === CartStatusEnum.COMPLETED;
  }

  isAbandoned(): boolean {
    return this._value === CartStatusEnum.ABANDONED;
  }

  isExpired(): boolean {
    return this._value === CartStatusEnum.EXPIRED;
  }

  equals(other: CartStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
