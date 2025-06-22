/**
 * Shopping Cart Organism Component
 * Displays cart items and summary using CartItem molecules and domain hooks
 */

import React from 'react';
import { CartItemComponent } from '../../molecules/CartItem';
import { Button, Spinner } from '../../atoms';
import { useCart } from '../../../hooks/domain/useCart';
import { Cart } from '../../../domain/aggregates/cart/Cart';
import { Product } from '../../../domain/aggregates/product/Product';

export interface ShoppingCartProps {
  cart: Cart;
  products: Record<string, Product>; // Map of productId -> Product
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onClearCart?: () => void;
  onCheckout?: () => void;
  isLoading?: boolean;
  className?: string;
  'data-testid'?: string;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  cart,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  isLoading = false,
  className = '',
  'data-testid': testId,
}) => {
  const items = cart.items;
  const totalAmount = cart.calculateTotal().toDisplayString();
  const itemCount = cart.itemCount;

  if (items.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`} data-testid={`${testId}-empty`}>
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v6a2 2 0 002 2h8a2 2 0 002-2v-6" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
        <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
        <div className="mt-6">
          <Button variant="primary" onClick={() => window.location.href = '/products'}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`} data-testid={testId}>
      {/* Cart Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900" data-testid={`${testId}-title`}>
            Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h2>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearCart}
              disabled={isLoading}
              data-testid={`${testId}-clear-btn`}
            >
              Clear Cart
            </Button>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <div className="px-6" data-testid={`${testId}-items`}>
        {items.map((item) => {
          const product = products[item.productId.value];
          if (!product) {
            return (
              <div key={item.id} className="py-4 text-red-600" data-testid={`${testId}-missing-product`}>
                Product not found for item {item.id}
              </div>
            );
          }

          return (
            <CartItemComponent
              key={item.id}
              cartItem={item}
              product={product}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemoveItem}
              isLoading={isLoading}
              data-testid={`${testId}-item-${item.id}`}
            />
          );
        })}
      </div>

      {/* Cart Summary */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50" data-testid={`${testId}-summary`}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-medium text-gray-900">Total:</span>
          <span className="text-lg font-bold text-gray-900" data-testid={`${testId}-total`}>
            {totalAmount}
          </span>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            onClick={onCheckout}
            disabled={isLoading || items.length === 0}
            loading={isLoading}
            className="w-full"
            data-testid={`${testId}-checkout-btn`}
          >
            Proceed to Checkout
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => window.location.href = '/products'}
            className="w-full"
            data-testid={`${testId}-continue-shopping-btn`}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
