/**
 * Promotion Aggregate
 * DDD Aggregate root for promotion domain
 */

import { Id } from '../../valueobjects/shared/Id';
import { Money } from '../../valueobjects/shared/Money';
import {
  PromotionId,
  PromotionCode,
  DiscountPercentage,
  FixedDiscount,
  MinimumPurchaseAmount,
  UsageLimit,
  PromotionStatus,
  PromotionType,
  PromotionPeriod
} from '../../valueobjects/promotion/PromotionValues';
import { ValidationError, BusinessRuleViolationError } from '../../errors/DomainErrors';

// Promotion Usage tracking
interface PromotionUsage {
  customerId: Id;
  usedAt: Date;
  orderAmount: Money;
  discountAmount: Money;
}

// Promotion aggregate root
export class Promotion {
  private constructor(
    private readonly _id: PromotionId,
    private readonly _code: PromotionCode,
    private readonly _name: string,
    private readonly _description: string,
    private readonly _type: PromotionType,
    private readonly _period: PromotionPeriod,
    private readonly _usageLimit: UsageLimit,
    private readonly _status: PromotionStatus,
    private readonly _applicableProductIds: Id[],
    private readonly _usageHistory: PromotionUsage[],
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _discountPercentage?: DiscountPercentage,
    private readonly _fixedDiscount?: FixedDiscount,
    private readonly _minimumPurchaseAmount?: MinimumPurchaseAmount
  ) {}

  // Factory methods
  static createPercentageDiscount(
    code: string,
    name: string,
    description: string,
    discountPercentage: number,
    startDate: Date,
    endDate: Date,
    usageLimit?: number,
    minimumPurchase?: Money,
    applicableProductIds?: Id[]
  ): Promotion {
    return new Promotion(
      PromotionId.generate(),
      PromotionCode.of(code),
      name,
      description,
      PromotionType.PERCENTAGE_DISCOUNT,
      PromotionPeriod.of(startDate, endDate),
      usageLimit ? UsageLimit.of(usageLimit) : UsageLimit.unlimited(),
      PromotionStatus.DRAFT,
      applicableProductIds || [],
      [],
      new Date(),
      new Date(),
      DiscountPercentage.of(discountPercentage),
      undefined,
      minimumPurchase ? MinimumPurchaseAmount.of(minimumPurchase) : undefined
    );
  }

  static createFixedAmountDiscount(
    code: string,
    name: string,
    description: string,
    fixedAmount: Money,
    startDate: Date,
    endDate: Date,
    usageLimit?: number,
    minimumPurchase?: Money,
    applicableProductIds?: Id[]
  ): Promotion {
    return new Promotion(
      PromotionId.generate(),
      PromotionCode.of(code),
      name,
      description,
      PromotionType.FIXED_AMOUNT_DISCOUNT,
      PromotionPeriod.of(startDate, endDate),
      usageLimit ? UsageLimit.of(usageLimit) : UsageLimit.unlimited(),
      PromotionStatus.DRAFT,
      applicableProductIds || [],
      [],
      new Date(),
      new Date(),
      undefined,
      FixedDiscount.of(fixedAmount),
      minimumPurchase ? MinimumPurchaseAmount.of(minimumPurchase) : undefined
    );
  }

  static fromData(data: {
    id: string;
    code: string;
    name: string;
    description: string;
    type: PromotionType;
    discountPercentage?: number;
    fixedDiscountAmount?: number;
    fixedDiscountCurrency?: string;
    minimumPurchaseAmount?: number;
    minimumPurchaseCurrency?: string;
    startDate: Date;
    endDate: Date;
    usageLimit: number;
    status: PromotionStatus;
    applicableProductIds: string[];
    usageHistory: any[];
    createdAt: Date;
    updatedAt: Date;
  }): Promotion {
    return new Promotion(
      PromotionId.of(data.id),
      PromotionCode.of(data.code),
      data.name,
      data.description,
      data.type,
      PromotionPeriod.of(data.startDate, data.endDate),
      UsageLimit.of(data.usageLimit),
      data.status,
      data.applicableProductIds.map(id => Id.of(id)),
      data.usageHistory,
      data.createdAt,
      data.updatedAt,
      data.discountPercentage ? DiscountPercentage.of(data.discountPercentage) : undefined,
      data.fixedDiscountAmount ? FixedDiscount.of(
        Money.of(data.fixedDiscountAmount, data.fixedDiscountCurrency || 'USD')
      ) : undefined,
      data.minimumPurchaseAmount ? MinimumPurchaseAmount.of(
        Money.of(data.minimumPurchaseAmount, data.minimumPurchaseCurrency || 'USD')
      ) : undefined
    );
  }

  // Getters
  get id(): PromotionId {
    return this._id;
  }

  get code(): PromotionCode {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get type(): PromotionType {
    return this._type;
  }

  get discountPercentage(): DiscountPercentage | undefined {
    return this._discountPercentage;
  }

  get fixedDiscount(): FixedDiscount | undefined {
    return this._fixedDiscount;
  }

  get minimumPurchaseAmount(): MinimumPurchaseAmount | undefined {
    return this._minimumPurchaseAmount;
  }

  get period(): PromotionPeriod {
    return this._period;
  }

  get usageLimit(): UsageLimit {
    return this._usageLimit;
  }

  get status(): PromotionStatus {
    return this._status;
  }

  get applicableProductIds(): Id[] {
    return [...this._applicableProductIds];
  }

  get usageHistory(): PromotionUsage[] {
    return [...this._usageHistory];
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  get updatedAt(): Date {
    return new Date(this._updatedAt);
  }

  // Domain methods
  activate(): Promotion {
    if (this._status === PromotionStatus.ACTIVE) {
      throw new BusinessRuleViolationError('Promotion is already active');
    }

    if (this._status === PromotionStatus.EXPIRED) {
      throw new BusinessRuleViolationError('Cannot activate expired promotion');
    }

    return new Promotion(
      this._id,
      this._code,
      this._name,
      this._description,
      this._type,
      this._period,
      this._usageLimit,
      PromotionStatus.ACTIVE,
      this._applicableProductIds,
      this._usageHistory,
      this._createdAt,
      new Date(),
      this._discountPercentage,
      this._fixedDiscount,
      this._minimumPurchaseAmount
    );
  }

  disable(): Promotion {
    return new Promotion(
      this._id,
      this._code,
      this._name,
      this._description,
      this._type,
      this._period,
      this._usageLimit,
      PromotionStatus.DISABLED,
      this._applicableProductIds,
      this._usageHistory,
      this._createdAt,
      new Date(),
      this._discountPercentage,
      this._fixedDiscount,
      this._minimumPurchaseAmount
    );
  }

  applyToAmount(amount: Money, customerId: Id, productIds: Id[] = []): Money {
    this.validateCanBeApplied(amount, customerId, productIds);

    let discountedAmount: Money;

    switch (this._type) {
      case PromotionType.PERCENTAGE_DISCOUNT:
        if (!this._discountPercentage) {
          throw new Error('Percentage discount not configured');
        }
        discountedAmount = this._discountPercentage.applyTo(amount);
        break;

      case PromotionType.FIXED_AMOUNT_DISCOUNT:
        if (!this._fixedDiscount) {
          throw new Error('Fixed discount not configured');
        }
        discountedAmount = this._fixedDiscount.applyTo(amount);
        break;

      default:
        throw new Error(`Promotion type ${this._type} not supported for amount calculation`);
    }

    // Ensure discounted amount is not negative
    return discountedAmount.isNegative() ? Money.zero(amount.currency) : discountedAmount;
  }

  calculateDiscountAmount(amount: Money, customerId: Id, productIds: Id[] = []): Money {
    const originalAmount = amount;
    const discountedAmount = this.applyToAmount(amount, customerId, productIds);
    return originalAmount.subtract(discountedAmount);
  }

  recordUsage(customerId: Id, orderAmount: Money, discountAmount: Money): Promotion {
    const usage: PromotionUsage = {
      customerId,
      usedAt: new Date(),
      orderAmount,
      discountAmount
    };

    return new Promotion(
      this._id,
      this._code,
      this._name,
      this._description,
      this._type,
      this._period,
      this._usageLimit,
      this._status,
      this._applicableProductIds,
      [...this._usageHistory, usage],
      this._createdAt,
      new Date(),
      this._discountPercentage,
      this._fixedDiscount,
      this._minimumPurchaseAmount
    );
  }

  // Query methods
  isActive(date: Date = new Date()): boolean {
    return this._status === PromotionStatus.ACTIVE && this._period.isActive(date);
  }

  hasExpired(date: Date = new Date()): boolean {
    return this._period.hasExpired(date);
  }

  canBeUsedBy(customerId: Id): boolean {
    const customerUsageCount = this._usageHistory.filter(
      usage => usage.customerId.equals(customerId)
    ).length;

    return this._usageLimit.canBeUsed(customerUsageCount);
  }

  isApplicableToProducts(productIds: Id[]): boolean {
    if (this._applicableProductIds.length === 0) {
      return true; // Applies to all products
    }

    return productIds.some(productId =>
      this._applicableProductIds.some(applicableId => applicableId.equals(productId))
    );
  }

  meetsMinimumPurchase(amount: Money): boolean {
    if (!this._minimumPurchaseAmount) {
      return true;
    }

    return this._minimumPurchaseAmount.isMetBy(amount);
  }

  getTotalUsageCount(): number {
    return this._usageHistory.length;
  }

  getRemainingUsage(): number {
    if (this._usageLimit.isUnlimited()) {
      return Number.MAX_SAFE_INTEGER;
    }

    return Math.max(0, this._usageLimit.value() - this.getTotalUsageCount());
  }

  // Private helper methods
  private validateCanBeApplied(amount: Money, customerId: Id, productIds: Id[]): void {
    if (!this.isActive()) {
      throw new BusinessRuleViolationError('Promotion is not active');
    }

    if (!this.canBeUsedBy(customerId)) {
      throw new BusinessRuleViolationError('Customer has exceeded usage limit for this promotion');
    }

    if (!this.isApplicableToProducts(productIds)) {
      throw new BusinessRuleViolationError('Promotion is not applicable to the selected products');
    }

    if (!this.meetsMinimumPurchase(amount)) {
      throw new BusinessRuleViolationError('Order amount does not meet minimum purchase requirement');
    }
  }

  // Conversion methods
  toPlainObject() {
    return {
      id: this._id.value,
      code: this._code.value(),
      name: this._name,
      description: this._description,
      type: this._type,
      discountPercentage: this._discountPercentage?.value(),
      fixedDiscount: this._fixedDiscount ? {
        amount: this._fixedDiscount.amount().amount,
        currency: this._fixedDiscount.amount().currency
      } : null,
      minimumPurchaseAmount: this._minimumPurchaseAmount ? {
        amount: this._minimumPurchaseAmount.amount().amount,
        currency: this._minimumPurchaseAmount.amount().currency
      } : null,
      period: {
        startDate: this._period.startDate(),
        endDate: this._period.endDate()
      },
      usageLimit: this._usageLimit.value(),
      status: this._status,
      applicableProductIds: this._applicableProductIds.map(id => id.value),
      usageHistory: this._usageHistory,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
