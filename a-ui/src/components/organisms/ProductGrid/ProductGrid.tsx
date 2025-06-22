/**
 * Product Grid Organism Component
 * Displays a grid of products using ProductCard molecules
 */

import React from 'react';
import { ProductCard } from '../../molecules/ProductCard';
import { Spinner } from '../../atoms';
import { Product } from '../../../domain/aggregates/product/Product';

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
  emptyMessage?: string;
  className?: string;
  'data-testid'?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onAddToCart,
  onAddToWishlist,
  onViewDetails,
  emptyMessage = 'No products found',
  className = '',
  'data-testid': testId,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12" data-testid={`${testId}-loading`}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12" data-testid={`${testId}-empty`}>
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
        <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
      data-testid={testId}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id.value}
          product={product}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          onViewDetails={onViewDetails}
          data-testid={`${testId}-product-${product.id.value}`}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
