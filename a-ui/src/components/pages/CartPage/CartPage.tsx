/**
 * Cart Page Component
 * Displays the shopping cart with integrated domain logic
 */

'use client';

import React from 'react';
import { Navigation, ShoppingCart } from '../../';
import { useCart } from '../../../hooks/domain/useCart';
import { useProduct } from '../../../hooks/domain/useProduct';
import { useApplicationLifecycle } from '../../../hooks/lifecycle/useApplicationLifecycle';

export interface CartPageProps {
  className?: string;
  'data-testid'?: string;
}

const CartPage: React.FC<CartPageProps> = ({
  className = '',
  'data-testid': testId,
}) => {
  const { currentState, isLoading } = useApplicationLifecycle();

  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading: cartLoading,
  } = useCart();

  const {
    products,
    getProductById,
  } = useProduct();

  // Convert products array to a map for quick lookup
  const productsMap = React.useMemo(() => {
    const map: Record<string, any> = {};
    products.forEach((product: any) => {
      map[product.id.value] = product;
    });
    return map;
  }, [products]);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateQuantity(itemId, quantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // TODO: Show error notification
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
      // TODO: Show error notification
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // TODO: Show error notification
    }
  };

  const handleCheckout = () => {
    window.location.href = '/checkout';
  };

  const handleCartClick = () => {
    // Already on cart page, do nothing or scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid={`${testId}-title`}>
            Shopping Cart
          </h1>
          <p className="mt-2 text-gray-600">
            Review your items before checkout
          </p>
        </div>

        {/* Shopping Cart */}
        {cart && (
          <ShoppingCart
            cart={cart}
            products={productsMap}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
            isLoading={cartLoading || isLoading()}
            data-testid={`${testId}-shopping-cart`}
          />
        )}

        {!cart && (
          <div className="text-center py-12" data-testid={`${testId}-no-cart`}>
            <p className="text-gray-500">Loading cart...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
