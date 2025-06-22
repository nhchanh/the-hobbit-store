/**
 * Product Card Molecule Component
 * Displays product information in a card format
 */

import React from 'react';
import { Button, Image } from '../../atoms';
import { Product } from '../../../domain/aggregates/product/Product';
import { Money } from '../../../domain/valueobjects/shared/Money';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
  isLoading?: boolean;
  className?: string;
  'data-testid'?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onViewDetails,
  isLoading = false,
  className = '',
  'data-testid': testId,
}) => {
  const primaryImage = product.getPrimaryImage() || '/images/product-placeholder.png';
  const formattedPrice = product.price.toDisplayString();
  const rating = product.rating.value;

  const handleAddToCart = () => {
    onAddToCart?.(product.id.value);
  };

  const handleAddToWishlist = () => {
    onAddToWishlist?.(product.id.value);
  };

  const handleViewDetails = () => {
    onViewDetails?.(product.id.value);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}
      data-testid={testId}
    >
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.name.value}
          className="w-full h-full object-cover"
          data-testid={`${testId}-image`}
        />
        {/* Wishlist Button */}
        <button
          onClick={handleAddToWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          data-testid={`${testId}-wishlist-btn`}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h3
          className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={handleViewDetails}
          data-testid={`${testId}-name`}
        >
          {product.name.value}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2" data-testid={`${testId}-description`}>
          {product.description.value}
        </p>

        {/* Rating */}
        {rating && rating > 0 && (
          <div className="flex items-center mb-3" data-testid={`${testId}-rating`}>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-sm text-gray-600">({rating})</span>
            </div>
          </div>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900" data-testid={`${testId}-price`}>
            {formattedPrice}
          </span>
          <Button
            onClick={handleAddToCart}
            variant="primary"
            size="sm"
            loading={isLoading}
            data-testid={`${testId}-add-to-cart-btn`}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
