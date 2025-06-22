/**
 * Cart Item Molecule Component
 * Displays cart item with quantity controls
 */

import React from 'react';
import { Button, Image } from '../../atoms';
import { CartItem } from '../../../domain/aggregates/cart/CartItem';
import { Product } from '../../../domain/aggregates/product/Product';

export interface CartItemComponentProps {
  cartItem: CartItem;
  product: Product; // Product details fetched separately
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemove?: (itemId: string) => void;
  isLoading?: boolean;
  className?: string;
  'data-testid'?: string;
}

const CartItemComponent: React.FC<CartItemComponentProps> = ({
  cartItem,
  product,
  onUpdateQuantity,
  onRemove,
  isLoading = false,
  className = '',
  'data-testid': testId,
}) => {
  const quantity = cartItem.quantity.value;
  const totalPrice = cartItem.calculateSubtotal().toDisplayString();
  const unitPrice = cartItem.unitPrice.toDisplayString();
  const primaryImage = product.getPrimaryImage() || '/images/product-placeholder.png';

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= 99) {
      onUpdateQuantity?.(cartItem.id, newQuantity);
    }
  };

  const handleRemove = () => {
    onRemove?.(cartItem.id);
  };

  return (
    <div
      className={`flex items-center space-x-4 py-4 border-b border-gray-200 ${className}`}
      data-testid={testId}
    >
      {/* Product Image */}
      <div className="flex-shrink-0 w-16 h-16">
        <Image
          src={primaryImage}
          alt={product.name.value}
          className="w-full h-full object-cover rounded-md"
          data-testid={`${testId}-image`}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate" data-testid={`${testId}-name`}>
          {product.name.value}
        </h4>
        <p className="text-sm text-gray-500" data-testid={`${testId}-unit-price`}>
          {unitPrice} each
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2" data-testid={`${testId}-quantity-controls`}>
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1 || isLoading}
          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid={`${testId}-decrease-btn`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <span className="px-3 py-1 text-sm font-medium text-gray-900 min-w-[2rem] text-center" data-testid={`${testId}-quantity`}>
          {quantity}
        </span>

        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={quantity >= 99 || isLoading}
          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid={`${testId}-increase-btn`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Total Price */}
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900" data-testid={`${testId}-total-price`}>
          {totalPrice}
        </p>
      </div>

      {/* Remove Button */}
      <div className="flex-shrink-0">
        <button
          onClick={handleRemove}
          disabled={isLoading}
          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid={`${testId}-remove-btn`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItemComponent;
