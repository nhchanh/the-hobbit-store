/**
 * PhoneNumber Value Object
 * Ensures phone number validation and immutability
 */

export class PhoneNumber {
  private readonly _value: string;
  private readonly _countryCode: string;
  private readonly _nationalNumber: string;

  constructor(value: string, countryCode?: string) {
    const normalized = this.normalize(value);
    this.validate(normalized);

    this._value = normalized;
    this._countryCode = countryCode || this.extractCountryCode(normalized);
    this._nationalNumber = this.extractNationalNumber(normalized);
  }

  get value(): string {
    return this._value;
  }

  get countryCode(): string {
    return this._countryCode;
  }

  get nationalNumber(): string {
    return this._nationalNumber;
  }

  private normalize(value: string): string {
    // Remove all non-digit characters except + at the beginning
    let normalized = value.replace(/[^\d+]/g, '');

    // Ensure it starts with + for international format
    if (!normalized.startsWith('+')) {
      // Default to US if no country code provided
      normalized = '+1' + normalized;
    }

    return normalized;
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Phone number cannot be empty');
    }

    if (!value.startsWith('+')) {
      throw new Error('Phone number must include country code (start with +)');
    }

    // Remove the + for validation
    const digits = value.substring(1);

    if (digits.length < 7 || digits.length > 15) {
      throw new Error('Phone number must be between 7 and 15 digits');
    }

    if (!/^\d+$/.test(digits)) {
      throw new Error('Phone number can only contain digits after country code');
    }

    // Validate common country codes
    const validCountryCodes = ['1', '44', '49', '33', '39', '34', '81', '86', '91', '55'];
    const countryCode = this.extractCountryCode(value);

    // For now, we'll be lenient and accept any country code
    if (countryCode.length === 0) {
      throw new Error('Invalid country code');
    }
  }

  private extractCountryCode(value: string): string {
    // Simple extraction - in a real app, you'd use a proper phone library
    if (value.startsWith('+1')) return '1';
    if (value.startsWith('+44')) return '44';
    if (value.startsWith('+49')) return '49';
    if (value.startsWith('+33')) return '33';
    if (value.startsWith('+39')) return '39';
    if (value.startsWith('+34')) return '34';
    if (value.startsWith('+81')) return '81';
    if (value.startsWith('+86')) return '86';
    if (value.startsWith('+91')) return '91';
    if (value.startsWith('+55')) return '55';

    // Default extraction - take first 1-3 digits after +
    const match = value.match(/^\+(\d{1,3})/);
    return match ? match[1] : '';
  }

  private extractNationalNumber(value: string): string {
    const countryCode = this.extractCountryCode(value);
    return value.substring(1 + countryCode.length);
  }

  equals(other: PhoneNumber): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  // Static factory methods
  static of(value: string, countryCode?: string): PhoneNumber {
    return new PhoneNumber(value, countryCode);
  }

  // Utility methods
  toInternationalFormat(): string {
    return this._value;
  }

  toNationalFormat(): string {
    // Simple formatting - in a real app, you'd use a proper phone library
    const national = this._nationalNumber;

    if (this._countryCode === '1' && national.length === 10) {
      // US format: (123) 456-7890
      return `(${national.substring(0, 3)}) ${national.substring(3, 6)}-${national.substring(6)}`;
    }

    return national;
  }

  toE164Format(): string {
    return this._value;
  }

  getCountryName(): string {
    // Simple mapping - in a real app, you'd use a proper country library
    const countryMap: { [key: string]: string } = {
      '1': 'United States/Canada',
      '44': 'United Kingdom',
      '49': 'Germany',
      '33': 'France',
      '39': 'Italy',
      '34': 'Spain',
      '81': 'Japan',
      '86': 'China',
      '91': 'India',
      '55': 'Brazil'
    };

    return countryMap[this._countryCode] || 'Unknown';
  }

  isUS(): boolean {
    return this._countryCode === '1';
  }

  isUK(): boolean {
    return this._countryCode === '44';
  }

  isMobile(): boolean {
    // Simple heuristic - in a real app, you'd use proper phone type detection
    if (this._countryCode === '1') {
      // US mobile numbers often start with certain area codes
      const areaCode = this._nationalNumber.substring(0, 3);
      const mobileAreaCodes = ['201', '202', '203', '212', '213', '214', '215', '216'];
      return mobileAreaCodes.includes(areaCode);
    }

    // Default assumption for other countries
    return true;
  }
}
