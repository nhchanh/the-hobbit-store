/**
 * Domain: Error - Cart Domain Error
 * Following DDD principles - domain-specific errors
 */

export class CartDomainError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'CartDomainError';

    // Maintains proper stack trace for where error was thrown (only available on V8)
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, CartDomainError);
    }
  }

  static invalidStatus(currentStatus: string, attemptedAction: string): CartDomainError {
    return new CartDomainError(
      `Cannot ${attemptedAction} when cart status is ${currentStatus}`,
      'INVALID_STATUS',
      { currentStatus, attemptedAction }
    );
  }

  static itemNotFound(productId: string): CartDomainError {
    return new CartDomainError(
      `Item with product ID ${productId} not found in cart`,
      'ITEM_NOT_FOUND',
      { productId }
    );
  }

  static maxItemsExceeded(currentCount: number, maxItems: number): CartDomainError {
    return new CartDomainError(
      `Cart cannot contain more than ${maxItems} items. Current: ${currentCount}`,
      'MAX_ITEMS_EXCEEDED',
      { currentCount, maxItems }
    );
  }
}
