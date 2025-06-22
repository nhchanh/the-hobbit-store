/**
 * Navigation Molecule Component
 * Main navigation bar with cart badge and user menu
 */

import React from 'react';
import { Button } from '../../atoms';

export interface NavigationProps {
  cartItemCount?: number;
  isAuthenticated?: boolean;
  userName?: string;
  onCartClick?: () => void;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  className?: string;
  'data-testid'?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  cartItemCount = 0,
  isAuthenticated = false,
  userName,
  onCartClick,
  onLoginClick,
  onLogoutClick,
  onProfileClick,
  onHomeClick,
  className = '',
  'data-testid': testId,
}) => {
  return (
    <nav
      className={`bg-white shadow-sm border-b border-gray-200 ${className}`}
      data-testid={testId}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button
              onClick={onHomeClick}
              className="flex-shrink-0 flex items-center"
              data-testid={`${testId}-logo`}
            >
              <img
                className="h-8 w-auto"
                src="/images/logo.png"
                alt="The Hobbit Store"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">
                The Hobbit Store
              </span>
            </button>
          </div>

          {/* Main Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="/products"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid={`${testId}-products-link`}
              >
                Products
              </a>
              <a
                href="/categories"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid={`${testId}-categories-link`}
              >
                Categories
              </a>
              <a
                href="/deals"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid={`${testId}-deals-link`}
              >
                Deals
              </a>
            </div>
          </div>

          {/* Right side - Cart and User */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              data-testid={`${testId}-cart-btn`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v6a2 2 0 002 2h8a2 2 0 002-2v-6" />
              </svg>
              {cartItemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  data-testid={`${testId}-cart-badge`}
                >
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>

            {/* User Authentication */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onProfileClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  data-testid={`${testId}-profile-btn`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {userName && <span className="hidden sm:block">{userName}</span>}
                </button>
                <Button
                  onClick={onLogoutClick}
                  variant="outline"
                  size="sm"
                  data-testid={`${testId}-logout-btn`}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={onLoginClick}
                variant="primary"
                size="sm"
                data-testid={`${testId}-login-btn`}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu - could be expanded as needed */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="/products"
            className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Products
          </a>
          <a
            href="/categories"
            className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Categories
          </a>
          <a
            href="/deals"
            className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Deals
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
