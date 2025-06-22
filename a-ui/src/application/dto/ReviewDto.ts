/**
 * Review Data Transfer Objects
 * Used for API communication and Redux state
 */

export interface ReviewDto {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  title: string;
  comment: string;
  rating: number;
  status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN' | 'FLAGGED';
  verificationStatus: 'UNVERIFIED' | 'VERIFIED_PURCHASE' | 'VERIFIED_REVIEWER';
  helpfulnessCount: number;
  images: ReviewImageDto[];
  isHelpful?: boolean; // For current user
  createdAt: string;
  updatedAt: string;
}

export interface ReviewImageDto {
  id: string;
  reviewId: string;
  url: string;
  caption?: string;
  displayOrder: number;
}

export interface CreateReviewDto {
  productId: string;
  title: string;
  comment: string;
  rating: number;
  images?: {
    url: string;
    caption?: string;
  }[];
}

export interface UpdateReviewDto {
  title?: string;
  comment?: string;
  rating?: number;
}

export interface ReviewSearchDto {
  productId?: string;
  customerId?: string;
  rating?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'HIDDEN' | 'FLAGGED';
  verificationStatus?: 'UNVERIFIED' | 'VERIFIED_PURCHASE' | 'VERIFIED_REVIEWER';
  sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful';
  page: number;
  limit: number;
}

export interface ReviewSearchResultDto {
  reviews: ReviewDto[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ReviewSummaryDto {
  productId: string;
  totalReviews: number;
  averageRating: number;
  verifiedReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
