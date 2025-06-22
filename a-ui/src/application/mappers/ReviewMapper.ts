import { Review } from '../../domain/aggregates/review/Review';
import { ReviewDto } from '../dto/ReviewDto';
import { ReviewId, Rating, ReviewComment, ReviewTitle, ReviewStatus, VerificationStatus, HelpfulnessCount } from '../../domain/valueobjects/review/ReviewValues';
import { Id } from '../../domain/valueobjects/shared/Id';

/**
 * Mapper for converting between Review domain objects and ReviewDto
 */
export class ReviewMapper {
  /**
   * Convert Review domain object to DTO
   */
  static toDto(review: Review): ReviewDto {
    return {
      id: review.id.value,
      productId: review.productId.value,
      customerId: review.customerId.value,
      customerName: '', // This would need to be populated from customer data
      title: review.title.value(),
      comment: review.comment.value(),
      rating: review.rating.value(),
      status: review.status.toString() as 'DRAFT' | 'PUBLISHED' | 'HIDDEN' | 'FLAGGED',
      verificationStatus: review.verificationStatus.toString() as 'UNVERIFIED' | 'VERIFIED_PURCHASE' | 'VERIFIED_REVIEWER',
      helpfulnessCount: review.helpfulnessCount.value(),
      images: review.images.map(img => ({
        id: img.id.value,
        reviewId: review.id.value,
        url: img.imageUrl,
        caption: img.caption,
        displayOrder: img.displayOrder,
      })),
      isHelpful: undefined, // Would be populated based on current user
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };
  }

  /**
   * Convert DTO to Review domain object
   */
  static toDomain(dto: ReviewDto): Review {
    return Review.fromData({
      id: dto.id,
      productId: dto.productId,
      customerId: dto.customerId,
      title: dto.title,
      comment: dto.comment,
      rating: dto.rating,
      status: ReviewStatus[dto.status],
      verificationStatus: VerificationStatus[dto.verificationStatus],
      helpfulnessCount: dto.helpfulnessCount,
      images: dto.images.map(img => ({
        id: Id.of(img.id),
        reviewId: ReviewId.of(img.reviewId),
        imageUrl: img.url,
        caption: img.caption,
        displayOrder: img.displayOrder,
      })),
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    });
  }

  /**
   * Convert array of Review domain objects to DTOs
   */
  static toDtoArray(reviews: Review[]): ReviewDto[] {
    return reviews.map(review => this.toDto(review));
  }

  /**
   * Convert array of DTOs to Review domain objects
   */
  static toDomainArray(dtos: ReviewDto[]): Review[] {
    return dtos.map(dto => this.toDomain(dto));
  }
}
