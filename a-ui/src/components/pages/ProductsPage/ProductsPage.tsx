/**
 * Products Page Component
 * Demonstrates integration of all layers: domain hooks, organisms, molecules, atoms
 */

'use client';

import React, { useEffect } from 'react';
import { Navigation, ProductGrid } from '../../';
import { useProduct } from '../../../hooks/domain/useProduct';
import { useCart } from '../../../hooks/domain/useCart';
import { useApplicationLifecycle } from '../../../hooks/lifecycle/useApplicationLifecycle';

export interface ProductsPageProps {
  className?: string;
  'data-testid'?: string;
}

const ProductsPage: React.FC<ProductsPageProps> = ({
  className = '',
  'data-testid': testId,
}) => {
  const { currentState, isLoading, startLoading, stopLoading } = useApplicationLifecycle();
  const {
    products,
    isLoading: productsLoading,
    fetchProducts,
    searchProducts,
  } = useProduct();

  const {
    cart,
    isLoading: cartLoading,
    addToCart,
  } = useCart();

  const {
    // TODO: Add wishlist hooks when implemented
  } = {};

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      startLoading();
      try {
        await fetchProducts();
      } finally {
        stopLoading();
      }
    };

    loadProducts();
  }, [fetchProducts, startLoading, stopLoading]);

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // TODO: Show error toast/notification
    }
  };

  const handleAddToWishlist = (productId: string) => {
    // TODO: Implement wishlist functionality
    console.log('Add to wishlist:', productId);
  };

  const handleViewDetails = (productId: string) => {
    window.location.href = `/products/${productId}`;
  };

  const handleCartClick = () => {
    window.location.href = '/cart';
  };

  const cartItemCount = cart?.itemCount || 0;

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`} data-testid={testId}>
      {/* Navigation */}
      <Navigation
        cartItemCount={cartItemCount}
        onCartClick={handleCartClick}
        onHomeClick={() => window.location.href = '/'}
        data-testid={`${testId}-navigation`}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid={`${testId}-title`}>
            Products
          </h1>
          <p className="mt-2 text-gray-600">
            Discover our amazing collection of products
          </p>
        </div>

        {/* Error State - TODO: Add error handling to hooks */}
        {false && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6" data-testid={`${testId}-error`}>
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
                <p className="mt-1 text-sm text-red-700">Error placeholder</p>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <ProductGrid
          products={products}
          isLoading={productsLoading || isLoading()}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onViewDetails={handleViewDetails}
          emptyMessage="No products available at the moment."
          data-testid={`${testId}-product-grid`}
        />
      </main>
    </div>
  );
};

export default ProductsPage;
