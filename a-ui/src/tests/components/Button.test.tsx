/**
 * Component Unit Tests - Button Atom
 * Tests for atomic design components with React Testing Library
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../components/atoms/Button/Button';

describe('Button Atom Component', () => {
  describe('Rendering', () => {
    it('should render button with children', () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it('should render with correct variant classes', () => {
      render(<Button variant="primary">Primary Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600');
    });

    it('should render with correct size classes', () => {
      render(<Button size="lg">Large Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });

    it('should render disabled state correctly', () => {
      render(<Button disabled>Disabled Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  describe('Interaction', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick} disabled>Disabled Button</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should handle keyboard events', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Press me</Button>);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading State', () => {
    it('should show loading state correctly', () => {
      render(<Button loading>Loading Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(screen.getByTestId('button-spinner')).toBeInTheDocument();
    });

    it('should not call onClick when loading', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick} loading>Loading Button</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      render(<Button disabled>Disabled Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should support custom test ID', () => {
      render(<Button data-testid="custom-button">Test Button</Button>);

      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });

    it('should have proper button type by default', () => {
      render(<Button>Default Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should support submit type', () => {
      render(<Button type="submit">Submit Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('Variants', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;

    variants.forEach(variant => {
      it(`should render ${variant} variant correctly`, () => {
        render(<Button variant={variant}>{variant} Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        // Each variant would have specific CSS classes to test
      });
    });
  });

  describe('Sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach(size => {
      it(`should render ${size} size correctly`, () => {
        render(<Button size={size}>{size} Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        // Each size would have specific CSS classes to test
      });
    });
  });
});
