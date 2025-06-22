/**
 * Review Query Hooks
 * React Query hooks for review domain operations
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { reviewApiClient } from '../../api';
import { ReviewMapper } from '../../../application/mappers/ReviewMapper';
import { queryKeys, invalidateQueries } from '../queryClient';
import { Review } from '../../../domain/aggregates/review/Review';
import { CreateReviewDto, UpdateReviewDto } from '../../../application/dto/ReviewDto';

// Query: Fetch reviews for a product
export const useProductReviews = (productId: string, options?: {
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'date' | 'helpfulness';
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: queryKeys.reviews.byProduct(productId),
    queryFn: async () => {
      const result = await reviewApiClient.getByProductId(productId, {
        page: options?.page || 1,
        limit: options?.limit || 10,
        sortBy: options?.sortBy || 'date',
        sortOrder: options?.sortOrder || 'desc',
      });
      return {
        ...result,
        data: result.data.map(ReviewMapper.toDomain),
      };
    },
    staleTime: 5 * 60 * 1000, // Reviews can be cached for 5 minutes
  });
};

// Infinite Query: Fetch reviews with pagination
export const useInfiniteProductReviews = (productId: string) => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.reviews.byProduct(productId), 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await reviewApiClient.getByProductId(productId, {
        page: pageParam,
        limit: 10,
        sortBy: 'date',
        sortOrder: 'desc',
      });
      return {
        reviews: result.data.map(ReviewMapper.toDomain),
        nextPage: result.data.length === 10 ? pageParam + 1 : undefined,
        ...result,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
};

// Query: Fetch reviews by customer
export const useCustomerReviews = (customerId: string) => {
  return useQuery({
    queryKey: queryKeys.reviews.byCustomer(customerId),
    queryFn: async () => {
      const result = await reviewApiClient.getByCustomerId(customerId);
      return result.data.map(ReviewMapper.toDomain);
    },
    staleTime: 2 * 60 * 1000, // Customer reviews cached for 2 minutes
  });
};

// Query: Get single review
export const useReview = (reviewId: string) => {
  return useQuery({
    queryKey: queryKeys.reviews.detail(reviewId),
    queryFn: async () => {
      const review = await reviewApiClient.getById(reviewId);
      return review ? ReviewMapper.toDomain(review) : null;
    },
  });
};

// Query: Get review statistics for a product
export const useProductReviewStats = (productId: string) => {
  return useQuery({
    queryKey: [...queryKeys.reviews.byProduct(productId), 'stats'],
    queryFn: async () => {
      return await reviewApiClient.getProductRatingSummary(productId);
    },
    staleTime: 10 * 60 * 1000, // Stats can be cached longer (10 minutes)
  });
};

// Mutation: Create new review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: CreateReviewDto) => {
      const createdReview = await reviewApiClient.create(reviewData);
      return ReviewMapper.toDomain(createdReview);
    },
    onSuccess: (data) => {
      // Invalidate relevant review queries
      invalidateQueries.reviews();
      invalidateQueries.products(); // Product ratings might change

      console.log('Review created successfully:', data.id);
    },
    onError: (error) => {
      console.error('Failed to create review:', error);
    },
  });
};

// Mutation: Update review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, updateData }: {
      reviewId: string;
      updateData: UpdateReviewDto;
    }) => {
      const updatedReview = await reviewApiClient.update(reviewId, updateData);
      return ReviewMapper.toDomain(updatedReview);
    },
    onMutate: async ({ reviewId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.reviews.detail(reviewId) });

      // Snapshot the previous review
      const previousReview = queryClient.getQueryData<Review | null>(queryKeys.reviews.detail(reviewId));

      return { previousReview };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousReview) {
        queryClient.setQueryData(queryKeys.reviews.detail(variables.reviewId), context.previousReview);
      }
      console.error('Failed to update review:', err);
    },
    onSuccess: (data) => {
      // Update the cache with the new review
      queryClient.setQueryData(queryKeys.reviews.detail(data.id.value), data);

      // Invalidate related queries
      invalidateQueries.reviews();
      invalidateQueries.products(); // Product ratings might change
    },
  });
};

// Mutation: Delete review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      await reviewApiClient.deleteReview(reviewId);
      return reviewId;
    },
    onSuccess: (reviewId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.reviews.detail(reviewId) });

      // Invalidate related queries
      invalidateQueries.reviews();
      invalidateQueries.products(); // Product ratings might change
    },
    onError: (error) => {
      console.error('Failed to delete review:', error);
    },
  });
};

// Mutation: Mark review as helpful
export const useMarkReviewHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, helpful }: { reviewId: string; helpful: boolean }) => {
      if (helpful) {
        return await reviewApiClient.markHelpful(reviewId);
      } else {
        return await reviewApiClient.markUnhelpful(reviewId);
      }
    },
    onSuccess: (_, { reviewId }) => {
      // Invalidate the specific review and product reviews
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.detail(reviewId) });
      // The product reviews will be updated when refetched
    },
    onError: (error) => {
      console.error('Failed to mark review as helpful:', error);
    },
  });
};

// Mutation: Flag review for moderation
export const useFlagReview = () => {
  return useMutation({
    mutationFn: async ({ reviewId, reason }: { reviewId: string; reason: string }) => {
      return await reviewApiClient.flag(reviewId, reason);
    },
    onSuccess: () => {
      console.log('Review flagged successfully');
    },
    onError: (error) => {
      console.error('Failed to flag review:', error);
    },
  });
};
