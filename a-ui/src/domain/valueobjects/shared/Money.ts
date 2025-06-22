/**
 * Domain: Value Object - Money
 * Following DDD principles - immutable monetary value
 */

export class Money {
  private constructor(
    private readonly _amount: number,
    private readonly _currency: string = 'USD'
  ) {
    this.validateAmount(_amount);
    this.validateCurrency(_currency);
  }

  static of(amount: number, currency: string = 'USD'): Money {
    return new Money(amount, currency);
  }

  static zero(currency: string = 'USD'): Money {
    return new Money(0, currency);
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this._amount - other._amount, this._currency);
  }

  multiply(factor: number): Money {
    return new Money(this._amount * factor, this._currency);
  }

  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }
    return new Money(this._amount / divisor, this._currency);
  }

  isZero(): boolean {
    return this._amount === 0;
  }

  isPositive(): boolean {
    return this._amount > 0;
  }

  isNegative(): boolean {
    return this._amount < 0;
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  greaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount > other._amount;
  }

  lessThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount < other._amount;
  }

  greaterThanOrEqual(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount >= other._amount;
  }

  lessThanOrEqual(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount <= other._amount;
  }

  toString(): string {
    return `${this._currency} ${this._amount.toFixed(2)}`;
  }

  toDisplayString(): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this._currency,
    });
    return formatter.format(this._amount);
  }

  private validateAmount(amount: number): void {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    if (!Number.isFinite(amount)) {
      throw new Error('Money amount must be a finite number');
    }
  }

  private validateCurrency(currency: string): void {
    if (!currency || currency.length !== 3) {
      throw new Error('Currency must be a 3-character ISO code');
    }
  }

  private ensureSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new Error(`Cannot operate on different currencies: ${this._currency} vs ${other._currency}`);
    }
  }
}
