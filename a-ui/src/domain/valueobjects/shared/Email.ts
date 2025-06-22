/**
 * Email Value Object
 * Ensures email validation and immutability
 */

export class Email {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value.toLowerCase().trim();
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }

    if (value.length > 254) {
      throw new Error('Email cannot exceed 254 characters');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      throw new Error('Invalid email format');
    }

    // Check for consecutive dots
    if (value.includes('..')) {
      throw new Error('Email cannot contain consecutive dots');
    }

    // Check for dots at the beginning or end of local part
    const [localPart, domain] = value.split('@');
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      throw new Error('Email local part cannot start or end with a dot');
    }
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  // Static factory methods
  static of(value: string): Email {
    return new Email(value);
  }

  // Utility methods
  getDomain(): string {
    return this._value.split('@')[1];
  }

  getLocalPart(): string {
    return this._value.split('@')[0];
  }

  isGmail(): boolean {
    return this.getDomain() === 'gmail.com';
  }

  isYahoo(): boolean {
    return this.getDomain() === 'yahoo.com';
  }

  isOutlook(): boolean {
    const domain = this.getDomain();
    return domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com';
  }

  isCorporate(): boolean {
    const commonPersonalDomains = [
      'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com',
      'aol.com', 'icloud.com', 'mail.com', 'protonmail.com'
    ];
    return !commonPersonalDomains.includes(this.getDomain());
  }
}
