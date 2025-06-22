/**
 * Product Query Hooks
 * React Query hooks for product domain operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApiClient } from '../../api';
import { ProductMapper } from '../../../application/mappers/ProductMapper';
import { queryKeys, invalidateQueries } from '../queryClient';
import { Product } from '../../../domain/aggregates/product/Product';
import { ProductDto } from '../../../application/dto/ProductDto';

// Query: Fetch all products
export const useProducts = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.products.list(filters || {}),
    queryFn: async () => {
      const response = await productApiClient.getAll(filters);
      return response.data.map((dto: ProductDto) => ProductMapper.toDomain(dto));
    },
    staleTime: 2 * 60 * 1000, // Products are relatively stable, 2 minutes
  });
};

// Query: Fetch single product by ID
export const useProduct = (productId: string | null) => {
  return useQuery({
    queryKey: queryKeys.products.detail(productId || ''),
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required');
      const dto = await productApiClient.getById(productId);
      if (!dto) throw new Error('Product not found');
      return ProductMapper.toDomain(dto);
    },
    enabled: !!productId, // Only run query if productId exists
    staleTime: 5 * 60 * 1000, // Product details change less frequently
  });
};

// Query: Search products
export const useProductSearch = (searchQuery: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.products.search(searchQuery),
    queryFn: async () => {
      const response = await productApiClient.search(searchQuery);
      return response.data.map((dto: ProductDto) => ProductMapper.toDomain(dto));
    },
    enabled: enabled && searchQuery.length > 2, // Only search with 3+ characters
    staleTime: 1 * 60 * 1000, // Search results can be more volatile
  });
};

// Query: Fetch product categories
export const useProductCategories = () => {
  return useQuery({
    queryKey: queryKeys.products.categories,
    queryFn: async () => {
      // TODO: Implement getCategories method in ProductApiClient
      // For now, return empty array
      return [];
    },
    staleTime: 30 * 60 * 1000, // Categories change very infrequently
  });
};

// Mutation: Create new product (admin)
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      // TODO: Fix type mapping between ProductDto and CreateProductDto
      const createData = {
        name: product.name.value,
        description: product.description.value,
        price: product.price.amount,
        currency: product.price.currency,
        categoryId: product.categoryId.value.toString(),
        // Add other required fields
      };
      const createdDto = await productApiClient.create(createData);
      return ProductMapper.toDomain(createdDto);
    },
    onSuccess: () => {
      // Invalidate and refetch products list
      invalidateQueries.products();
    },
    onError: (error) => {
      console.error('Failed to create product:', error);
    },
  });
};

// Mutation: Update existing product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, product }: { productId: string; product: Product }) => {
      const dto = ProductMapper.toDto(product);
      const updatedDto = await productApiClient.update(productId, dto);
      return ProductMapper.toDomain(updatedDto);
    },
    onSuccess: (updatedProduct) => {
      // Update the specific product in cache
      queryClient.setQueryData(
        queryKeys.products.detail(updatedProduct.id.value),
        updatedProduct
      );

      // Invalidate products list to reflect changes
      invalidateQueries.products();
    },
    onError: (error) => {
      console.error('Failed to update product:', error);
    },
  });
};

// Mutation: Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      await productApiClient.deleteProduct(productId);
      return productId;
    },
    onSuccess: (deletedProductId) => {
      // Remove the product from cache
      queryClient.removeQueries({
        queryKey: queryKeys.products.detail(deletedProductId)
      });

      // Invalidate products list
      invalidateQueries.products();
    },
    onError: (error) => {
      console.error('Failed to delete product:', error);
    },
  });
};

// Optimistic update helper for product rating
export const useUpdateProductRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, rating }: { productId: string; rating: number }) => {
      // TODO: This would typically be handled by the review system
      // For now, we'll just invalidate the product cache
      await queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(productId)
      });
      return { productId, rating };
    },
    onMutate: async ({ productId, rating }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.products.detail(productId) });

      // Snapshot the previous value
      const previousProduct = queryClient.getQueryData<Product>(
        queryKeys.products.detail(productId)
      );

      // Optimistically update the cache
      if (previousProduct) {
        const updatedProduct = { ...previousProduct };
        // Update rating optimistically (would need proper domain method)
        queryClient.setQueryData(queryKeys.products.detail(productId), updatedProduct);
      }

      return { previousProduct };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousProduct) {
        queryClient.setQueryData(
          queryKeys.products.detail(variables.productId),
          context.previousProduct
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.productId)
      });
    },
  });
};
