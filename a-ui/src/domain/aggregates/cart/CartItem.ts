/**
 * Domain: Entity - Cart Item
 * Following DDD principles - entity within Cart aggregate
 */

import { ProductId } from '../valueobjects/product/ProductId';
import { Quantity } from '../valueobjects/cart/Quantity';
import { Money } from '../valueobjects/shared/Money';
import { ULID } from 'ulid';

export class CartItem {
  private constructor(
    private readonly _id: string,
    private readonly _productId: ProductId,
    private _quantity: Quantity,
    private readonly _unitPrice: Money,
  ) {}

  static create(
    productId: ProductId,
    quantity: Quantity,
    unitPrice: Money,
  ): CartItem {
    return new CartItem(
      ULID(),
      productId,
      quantity,
      unitPrice,
    );
  }

  static reconstitute(
    id: string,
    productId: ProductId,
    quantity: Quantity,
    unitPrice: Money,
  ): CartItem {
    return new CartItem(id, productId, quantity, unitPrice);
  }

  updateQuantity(newQuantity: Quantity): CartItem {
    return new CartItem(
      this._id,
      this._productId,
      newQuantity,
      this._unitPrice,
    );
  }

  calculateSubtotal(): Money {
    return this._unitPrice.multiply(this._quantity.value);
  }

  get id(): string {
    return this._id;
  }

  get productId(): ProductId {
    return this._productId;
  }

  get quantity(): Quantity {
    return this._quantity;
  }

  get unitPrice(): Money {
    return this._unitPrice;
  }

  equals(other: CartItem): boolean {
    return this._id === other._id;
  }
}
