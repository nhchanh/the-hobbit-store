/**
 * Review API Client
 * Handles HTTP communication with review endpoints
 */

import { ApiClient } from './ApiClient';
import { ReviewDto, CreateReviewDto, UpdateReviewDto } from '../../application/dto/ReviewDto';

export class ReviewApiClient extends ApiClient {
  private readonly basePath = '/reviews';

  /**
   * Get review by ID
   */
  async getById(reviewId: string): Promise<ReviewDto | null> {
    try {
      const response = await this.get<ReviewDto>(`${this.basePath}/${reviewId}`);
      return response.data;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get reviews by product ID
   */
  async getByProductId(productId: string, filters?: {
    rating?: number;
    verificationStatus?: 'UNVERIFIED' | 'VERIFIED_PURCHASE' | 'VERIFIED_REVIEWER';
    status?: 'DRAFT' | 'PUBLISHED' | 'HIDDEN' | 'FLAGGED';
    sortBy?: 'rating' | 'date' | 'helpfulness';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{
    data: ReviewDto[];
    totalCount: number;
    page: number;
    limit: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
  }> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${this.basePath}/product/${productId}?${queryParams.toString()}`
      : `${this.basePath}/product/${productId}`;

    const response = await this.get<{
      data: ReviewDto[];
      totalCount: number;
      page: number;
      limit: number;
      averageRating: number;
      ratingDistribution: Record<number, number>;
    }>(url);

    return response.data;
  }

  /**
   * Get reviews by customer ID
   */
  async getByCustomerId(customerId: string, filters?: {
    status?: 'DRAFT' | 'PUBLISHED' | 'HIDDEN' | 'FLAGGED';
    sortBy?: 'date' | 'rating';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{
    data: ReviewDto[];
    totalCount: number;
    page: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${this.basePath}/customer/${customerId}?${queryParams.toString()}`
      : `${this.basePath}/customer/${customerId}`;

    const response = await this.get<{
      data: ReviewDto[];
      totalCount: number;
      page: number;
      limit: number;
    }>(url);

    return response.data;
  }

  /**
   * Create new review
   */
  async create(createDto: CreateReviewDto): Promise<ReviewDto> {
    const response = await this.post<ReviewDto>(this.basePath, createDto);
    return response.data;
  }

  /**
   * Update existing review
   */
  async update(reviewId: string, updateDto: UpdateReviewDto): Promise<ReviewDto> {
    const response = await this.put<ReviewDto>(`${this.basePath}/${reviewId}`, updateDto);
    return response.data;
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId: string): Promise<void> {
    await this.delete<void>(`${this.basePath}/${reviewId}`);
  }

  /**
   * Publish review (moderation action)
   */
  async publish(reviewId: string): Promise<ReviewDto> {
    const response = await this.patch<ReviewDto>(`${this.basePath}/${reviewId}/publish`);
    return response.data;
  }

  /**
   * Hide review (moderation action)
   */
  async hide(reviewId: string): Promise<ReviewDto> {
    const response = await this.patch<ReviewDto>(`${this.basePath}/${reviewId}/hide`);
    return response.data;
  }

  /**
   * Flag review for moderation
   */
  async flag(reviewId: string, reason: string): Promise<ReviewDto> {
    const response = await this.patch<ReviewDto>(`${this.basePath}/${reviewId}/flag`, { reason });
    return response.data;
  }

  /**
   * Mark review as helpful
   */
  async markHelpful(reviewId: string): Promise<ReviewDto> {
    const response = await this.post<ReviewDto>(`${this.basePath}/${reviewId}/helpful`);
    return response.data;
  }

  /**
   * Mark review as unhelpful
   */
  async markUnhelpful(reviewId: string): Promise<ReviewDto> {
    const response = await this.post<ReviewDto>(`${this.basePath}/${reviewId}/unhelpful`);
    return response.data;
  }

  /**
   * Get product rating summary
   */
  async getProductRatingSummary(productId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
    verifiedPurchasePercentage: number;
  }> {
    const response = await this.get<{
      averageRating: number;
      totalReviews: number;
      ratingDistribution: Record<number, number>;
      verifiedPurchasePercentage: number;
    }>(`${this.basePath}/product/${productId}/summary`);
    return response.data;
  }

  /**
   * Upload review image
   */
  async uploadImage(reviewId: string, imageFile: File, caption?: string): Promise<{
    imageId: string;
    url: string;
  }> {
    // For now, this is a placeholder - actual implementation would use FormData
    const imageData = {
      fileName: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
      caption: caption
    };

    const response = await this.post<{ imageId: string; url: string }>(
      `${this.basePath}/${reviewId}/images`,
      imageData
    );
    return response.data;
  }

  /**
   * Delete review image
   */
  async deleteImage(reviewId: string, imageId: string): Promise<void> {
    await this.delete<void>(`${this.basePath}/${reviewId}/images/${imageId}`);
  }
}
