/**
 * Demo Page - React Query Integration
 * Demonstrates how to use React Query hooks with DDD architecture
 */

'use client';

import React from 'react';
import { useProductSearch, useAddToCart, useCart } from '../../../infrastructure/query/hooks';
import Button from '../../../components/atoms/Button/Button';
import Input from '../../../components/atoms/Input/Input';
import Spinner from '../../../components/atoms/Spinner/Spinner';

export function ReactQueryDemoPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);

  // Mock customer and cart IDs for demo
  const mockCustomerId = 'customer-123';
  const mockCartId = 'cart-456';

  // React Query hooks for products
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useProductSearch(searchTerm, searchTerm.length > 2);

  // React Query hooks for cart
  const {
    data: cart,
    isLoading: isCartLoading,
    error: cartError,
  } = useCart(mockCustomerId);

  // Mutation for adding to cart
  const addToCartMutation = useAddToCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is automatically triggered by the query hook when searchTerm changes
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCartMutation.mutateAsync({
        cartId: mockCartId,
        productId,
        quantity: 1,
      });
      alert('Product added to cart successfully!');
    } catch (error) {
      alert('Failed to add product to cart');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">React Query + DDD Integration Demo</h1>

      {/* Search Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Product Search</h2>
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? <Spinner size="sm" /> : 'Search'}
          </Button>
        </form>

        {searchError && (
          <div className="text-red-600 mb-4">
            Error searching products: {searchError.message}
          </div>
        )}

        {isSearching && (
          <div className="flex items-center gap-2 text-gray-600">
            <Spinner size="sm" />
            Searching products...
          </div>
        )}

        {searchResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((product) => (
              <div key={product.id.value} className="border rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{product.name.value}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    ${product.price.amount}
                  </span>
                  <Button
                    onClick={() => handleAddToCart(product.id.value)}
                    disabled={addToCartMutation.isPending}
                    size="sm"
                  >
                    {addToCartMutation.isPending ? (
                      <Spinner size="sm" />
                    ) : (
                      'Add to Cart'
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchResults && searchResults.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            No products found for "{searchTerm}"
          </div>
        )}
      </div>

      {/* Cart Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Current Cart</h2>

        {cartError && (
          <div className="text-red-600 mb-4">
            Error loading cart: {cartError.message}
          </div>
        )}

        {isCartLoading && (
          <div className="flex items-center gap-2 text-gray-600">
            <Spinner size="sm" />
            Loading cart...
          </div>
        )}

        {cart && cart.items.length > 0 && (
          <div className="border rounded-lg p-4">
            <div className="space-y-2 mb-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <span className="font-medium">Product {item.productId.value}</span>
                    <span className="text-gray-500 ml-2">Qty: {item.quantity.value}</span>
                  </div>
                  <span className="font-semibold">${item.calculateSubtotal().amount}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${cart.calculateTotal().amount}</span>
            </div>
          </div>
        )}

        {cart && cart.items.length === 0 && (
          <div className="text-gray-500 text-center py-8 border rounded-lg">
            Your cart is empty
          </div>
        )}
      </div>

      {/* Architecture Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Architecture Highlights</h2>
        <ul className="space-y-2 text-blue-700">
          <li>✅ <strong>React Query</strong>: Server state management with caching and background updates</li>
          <li>✅ <strong>DDD Domain Objects</strong>: Products and Cart items are proper domain aggregates</li>
          <li>✅ <strong>Type Safety</strong>: Full TypeScript integration throughout the stack</li>
          <li>✅ <strong>Error Handling</strong>: Proper error boundaries and user feedback</li>
          <li>✅ <strong>Optimistic Updates</strong>: Cart mutations with rollback on failure</li>
          <li>✅ <strong>Atomic Design</strong>: Reusable UI components (Button, Input, Spinner)</li>
          <li>✅ <strong>Clean Architecture</strong>: Clear separation between presentation, application, and domain layers</li>
        </ul>
      </div>
    </div>
  );
}
