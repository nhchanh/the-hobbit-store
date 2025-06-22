/**
 * Domain Validation Error
 * Used for validation errors in domain value objects
 */

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class BusinessRuleViolationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleViolationError';
  }
}

export class CustomerDomainError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'CustomerDomainError';
  }
}

export class OrderDomainError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'OrderDomainError';
  }
}
