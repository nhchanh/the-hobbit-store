/**
 * Footer Component
 * Simple footer for the application
 */

import React from 'react';

export interface FooterProps {
  className?: string;
  'data-testid'?: string;
}

export const Footer: React.FC<FooterProps> = ({
  className = '',
  'data-testid': testId = 'footer',
}) => {
  return (
    <footer
      className={`bg-gray-800 text-white py-6 ${className}`}
      data-testid={testId}
    >
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm">
            © 2025 The Hobbit Online Store. A magical shopping experience from the Shire.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Made with ❤️ for hobbits and hobbit-lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};
