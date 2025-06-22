/**
 * Domain: Product Aggregate Root
 * Following DDD principles - main aggregate for product management
 */

import { ProductId } from '../valueobjects/product/ProductId';
import { ProductName } from '../valueobjects/product/ProductName';
import { ProductDescription } from '../valueobjects/product/ProductDescription';
import { Money } from '../valueobjects/shared/Money';
import { ProductRating } from '../valueobjects/product/ProductRating';
import { CategoryId } from '../valueobjects/product/CategoryId';
import { CreatedAt, UpdatedAt } from '../valueobjects/shared/Timestamps';
import { ProductDomainError } from '../errors/ProductDomainError';

export class Product {
  private constructor(
    private readonly _id: ProductId,
    private _name: ProductName,
    private _description: ProductDescription,
    private _price: Money,
    private _rating: ProductRating,
    private _categoryId: CategoryId,
    private _imageUrls: string[],
    private readonly _createdAt: CreatedAt,
    private _updatedAt: UpdatedAt,
    private _isActive: boolean = true,
  ) {}

  // Factory method for creating new product
  static create(
    name: ProductName,
    description: ProductDescription,
    price: Money,
    categoryId: CategoryId,
    imageUrls: string[] = [],
  ): Product {
    const now = new Date();
    return new Product(
      ProductId.generate(),
      name,
      description,
      price,
      ProductRating.unrated(),
      categoryId,
      imageUrls,
      CreatedAt.of(now),
      UpdatedAt.of(now),
      true,
    );
  }

  // Factory method for reconstituting from persistence
  static reconstitute(
    id: ProductId,
    name: ProductName,
    description: ProductDescription,
    price: Money,
    rating: ProductRating,
    categoryId: CategoryId,
    imageUrls: string[],
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
    isActive: boolean,
  ): Product {
    return new Product(
      id,
      name,
      description,
      price,
      rating,
      categoryId,
      imageUrls,
      createdAt,
      updatedAt,
      isActive,
    );
  }

  // Business logic: Update product details
  updateDetails(
    name: ProductName,
    description: ProductDescription,
    price: Money,
  ): void {
    this._name = name;
    this._description = description;
    this._price = price;
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Update rating
  updateRating(rating: ProductRating): void {
    this._rating = rating;
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Add image
  addImage(imageUrl: string): void {
    if (this._imageUrls.length >= 10) {
      throw ProductDomainError.maxImagesExceeded(this._imageUrls.length, 10);
    }

    if (!this.isValidImageUrl(imageUrl)) {
      throw ProductDomainError.invalidImageUrl(imageUrl);
    }

    this._imageUrls.push(imageUrl);
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Remove image
  removeImage(imageUrl: string): void {
    this._imageUrls = this._imageUrls.filter(url => url !== imageUrl);
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Activate/Deactivate product
  activate(): void {
    this._isActive = true;
    this._updatedAt = UpdatedAt.of(new Date());
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Getters (immutable access)
  get id(): ProductId { return this._id; }
  get name(): ProductName { return this._name; }
  get description(): ProductDescription { return this._description; }
  get price(): Money { return this._price; }
  get rating(): ProductRating { return this._rating; }
  get categoryId(): CategoryId { return this._categoryId; }
  get imageUrls(): readonly string[] { return Object.freeze([...this._imageUrls]); }
  get createdAt(): CreatedAt { return this._createdAt; }
  get updatedAt(): UpdatedAt { return this._updatedAt; }
  get isActive(): boolean { return this._isActive; }

  // Helper methods
  hasImages(): boolean {
    return this._imageUrls.length > 0;
  }

  getPrimaryImage(): string | null {
    return this._imageUrls.length > 0 ? this._imageUrls[0] : null;
  }

  private isValidImageUrl(url: string): boolean {
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    } catch {
      return false;
    }
  }
}
