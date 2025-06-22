/**
 * Domain: Cart Aggregate Root
 * Following DDD principles - this is the main aggregate for cart management
 */

import { CartItem } from './CartItem';
import { CartId } from '../valueobjects/cart/CartId';
import { CustomerId } from '../valueobjects/customer/CustomerId';
import { CartStatus } from '../valueobjects/cart/CartStatus';
import { Money } from '../valueobjects/shared/Money';
import { CreatedAt, UpdatedAt } from '../valueobjects/shared/Timestamps';
import { CartDomainError } from '../errors/CartDomainError';

export class Cart {
  private constructor(
    private readonly _id: CartId,
    private readonly _customerId: CustomerId,
    private _status: CartStatus,
    private _items: CartItem[],
    private readonly _createdAt: CreatedAt,
    private _updatedAt: UpdatedAt,
  ) {}

  // Factory method for creating new cart
  static create(customerId: CustomerId): Cart {
    const now = new Date();
    return new Cart(
      CartId.generate(),
      customerId,
      CartStatus.active(),
      [],
      CreatedAt.of(now),
      UpdatedAt.of(now),
    );
  }

  // Factory method for reconstituting from persistence
  static reconstitute(
    id: CartId,
    customerId: CustomerId,
    status: CartStatus,
    items: CartItem[],
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
  ): Cart {
    return new Cart(id, customerId, status, items, createdAt, updatedAt);
  }

  // Business logic: Add item to cart
  addItem(cartItem: CartItem): void {
    if (this._status.isCompleted()) {
      throw new CartDomainError('Cannot add items to completed cart');
    }

    const existingItemIndex = this._items.findIndex(item =>
      item.productId.equals(cartItem.productId)
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      this._items[existingItemIndex] = this._items[existingItemIndex].updateQuantity(
        this._items[existingItemIndex].quantity.add(cartItem.quantity)
      );
    } else {
      // Add new item
      this._items.push(cartItem);
    }

    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Remove item from cart
  removeItem(productId: string): void {
    if (this._status.isCompleted()) {
      throw new CartDomainError('Cannot remove items from completed cart');
    }

    this._items = this._items.filter(item =>
      !item.productId.equals(ProductId.of(productId))
    );
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Calculate total
  calculateTotal(): Money {
    return this._items.reduce(
      (total, item) => total.add(item.calculateSubtotal()),
      Money.zero()
    );
  }

  // Business logic: Complete cart (for checkout)
  complete(): void {
    if (this._items.length === 0) {
      throw new CartDomainError('Cannot complete empty cart');
    }

    this._status = CartStatus.completed();
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Clear cart
  clear(): void {
    this._items = [];
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Getters (immutable access)
  get id(): CartId { return this._id; }
  get customerId(): CustomerId { return this._customerId; }
  get status(): CartStatus { return this._status; }
  get items(): readonly CartItem[] { return Object.freeze([...this._items]); }
  get createdAt(): CreatedAt { return this._createdAt; }
  get updatedAt(): UpdatedAt { return this._updatedAt; }
  get itemCount(): number { return this._items.length; }
  get isEmpty(): boolean { return this._items.length === 0; }

  // Domain invariant checks
  private validateInvariants(): void {
    if (this._items.length > 100) {
      throw new CartDomainError('Cart cannot contain more than 100 items');
    }
  }
}
