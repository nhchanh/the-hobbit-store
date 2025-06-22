/**
 * Review Aggregate
 * DDD Aggregate root for review domain
 */

import { Id } from '../../valueobjects/shared/Id';
import {
  ReviewId,
  Rating,
  ReviewComment,
  ReviewTitle,
  ReviewStatus,
  VerificationStatus,
  HelpfulnessCount
} from '../../valueobjects/review/ReviewValues';

// Review Image entity within the aggregate
export interface ReviewImage {
  id: Id;
  reviewId: ReviewId;
  imageUrl: string;
  caption?: string;
  displayOrder: number;
}

// Review aggregate root
export class Review {
  private constructor(
    private readonly _id: ReviewId,
    private readonly _productId: Id,
    private readonly _customerId: Id,
    private readonly _title: ReviewTitle,
    private readonly _comment: ReviewComment,
    private readonly _rating: Rating,
    private readonly _status: ReviewStatus,
    private readonly _verificationStatus: VerificationStatus,
    private readonly _helpfulnessCount: HelpfulnessCount,
    private readonly _images: ReviewImage[],
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {}

  // Factory methods
  static create(
    productId: Id,
    customerId: Id,
    title: string,
    comment: string,
    rating: number
  ): Review {
    return new Review(
      ReviewId.generate(),
      productId,
      customerId,
      ReviewTitle.of(title),
      ReviewComment.of(comment),
      Rating.of(rating),
      ReviewStatus.DRAFT,
      VerificationStatus.UNVERIFIED,
      HelpfulnessCount.zero(),
      [],
      new Date(),
      new Date()
    );
  }

  static fromData(data: {
    id: string;
    productId: string;
    customerId: string;
    title: string;
    comment: string;
    rating: number;
    status: ReviewStatus;
    verificationStatus: VerificationStatus;
    helpfulnessCount: number;
    images: ReviewImage[];
    createdAt: Date;
    updatedAt: Date;
  }): Review {
    return new Review(
      ReviewId.of(data.id),
      Id.of(data.productId),
      Id.of(data.customerId),
      ReviewTitle.of(data.title),
      ReviewComment.of(data.comment),
      Rating.of(data.rating),
      data.status,
      data.verificationStatus,
      HelpfulnessCount.of(data.helpfulnessCount),
      data.images,
      data.createdAt,
      data.updatedAt
    );
  }

  // Getters
  get id(): ReviewId {
    return this._id;
  }

  get productId(): Id {
    return this._productId;
  }

  get customerId(): Id {
    return this._customerId;
  }

  get title(): ReviewTitle {
    return this._title;
  }

  get comment(): ReviewComment {
    return this._comment;
  }

  get rating(): Rating {
    return this._rating;
  }

  get status(): ReviewStatus {
    return this._status;
  }

  get verificationStatus(): VerificationStatus {
    return this._verificationStatus;
  }

  get helpfulnessCount(): HelpfulnessCount {
    return this._helpfulnessCount;
  }

  get images(): ReviewImage[] {
    return [...this._images];
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  get updatedAt(): Date {
    return new Date(this._updatedAt);
  }

  // Domain methods
  publish(): Review {
    if (this._status === ReviewStatus.PUBLISHED) {
      throw new Error('Review is already published');
    }

    return new Review(
      this._id,
      this._productId,
      this._customerId,
      this._title,
      this._comment,
      this._rating,
      ReviewStatus.PUBLISHED,
      this._verificationStatus,
      this._helpfulnessCount,
      this._images,
      this._createdAt,
      new Date()
    );
  }

  hide(): Review {
    return new Review(
      this._id,
      this._productId,
      this._customerId,
      this._title,
      this._comment,
      this._rating,
      ReviewStatus.HIDDEN,
      this._verificationStatus,
      this._helpfulnessCount,
      this._images,
      this._createdAt,
      new Date()
    );
  }

  flag(): Review {
    return new Review(
      this._id,
      this._productId,
      this._customerId,
      this._title,
      this._comment,
      this._rating,
      ReviewStatus.FLAGGED,
      this._verificationStatus,
      this._helpfulnessCount,
      this._images,
      this._createdAt,
      new Date()
    );
  }

  markHelpful(): Review {
    return new Review(
      this._id,
      this._productId,
      this._customerId,
      this._title,
      this._comment,
      this._rating,
      this._status,
      this._verificationStatus,
      this._helpfulnessCount.increment(),
      this._images,
      this._createdAt,
      new Date()
    );
  }

  verifyPurchase(): Review {
    return new Review(
      this._id,
      this._productId,
      this._customerId,
      this._title,
      this._comment,
      this._rating,
      this._status,
      VerificationStatus.VERIFIED_PURCHASE,
      this._helpfulnessCount,
      this._images,
      this._createdAt,
      new Date()
    );
  }

  update(title: string, comment: string, rating: number): Review {
    return new Review(
      this._id,
      this._productId,
      this._customerId,
      ReviewTitle.of(title),
      ReviewComment.of(comment),
      Rating.of(rating),
      this._status,
      this._verificationStatus,
      this._helpfulnessCount,
      this._images,
      this._createdAt,
      new Date()
    );
  }

  addImage(imageUrl: string, caption?: string): Review {
    const newImage: ReviewImage = {
      id: Id.random(),
      reviewId: this._id,
      imageUrl,
      caption,
      displayOrder: this._images.length + 1
    };

    return new Review(
      this._id,
      this._productId,
      this._customerId,
      this._title,
      this._comment,
      this._rating,
      this._status,
      this._verificationStatus,
      this._helpfulnessCount,
      [...this._images, newImage],
      this._createdAt,
      new Date()
    );
  }

  // Query methods
  isPublished(): boolean {
    return this._status === ReviewStatus.PUBLISHED;
  }

  isVerified(): boolean {
    return this._verificationStatus === VerificationStatus.VERIFIED_PURCHASE ||
           this._verificationStatus === VerificationStatus.VERIFIED_REVIEWER;
  }

  isHelpful(): boolean {
    return this._helpfulnessCount.value() > 0;
  }

  canBeModified(): boolean {
    return this._status === ReviewStatus.DRAFT;
  }

  // Conversion methods
  toPlainObject() {
    return {
      id: this._id.value,
      productId: this._productId.value,
      customerId: this._customerId.value,
      title: this._title.value(),
      comment: this._comment.value(),
      rating: this._rating.value(),
      status: this._status,
      verificationStatus: this._verificationStatus,
      helpfulnessCount: this._helpfulnessCount.value(),
      images: this._images,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
