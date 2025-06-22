/**
 * TypeScript declarations for Jest and Testing Library
 * Extends Jest matchers with Testing Library DOM matchers
 */

import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(...classNames: string[]): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeVisible(): R;
      toBeEmptyDOMElement(): R;
      toHaveFocus(): R;
      toHaveValue(value: string | number): R;
      toHaveDisplayValue(value: string | string[]): R;
      toBeChecked(): R;
      toBePartiallyChecked(): R;
      toHaveDescription(text?: string | RegExp): R;
      toHaveErrorMessage(text?: string | RegExp): R;
    }
  }
}
