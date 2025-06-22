/**
 * Address Value Object
 * Ensures address validation and immutability
 */

export interface AddressComponents {
  streetLine1: string;
  streetLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  company?: string;
}

export class Address {
  private readonly _streetLine1: string;
  private readonly _streetLine2?: string;
  private readonly _city: string;
  private readonly _state: string;
  private readonly _postalCode: string;
  private readonly _country: string;
  private readonly _company?: string;

  constructor(components: AddressComponents) {
    this.validate(components);

    this._streetLine1 = components.streetLine1.trim();
    this._streetLine2 = components.streetLine2?.trim();
    this._city = components.city.trim();
    this._state = components.state.trim();
    this._postalCode = components.postalCode.trim();
    this._country = components.country.trim().toUpperCase();
    this._company = components.company?.trim();
  }

  get streetLine1(): string {
    return this._streetLine1;
  }

  get streetLine2(): string | undefined {
    return this._streetLine2;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get postalCode(): string {
    return this._postalCode;
  }

  get country(): string {
    return this._country;
  }

  get company(): string | undefined {
    return this._company;
  }

  private validate(components: AddressComponents): void {
    if (!components.streetLine1 || components.streetLine1.trim().length === 0) {
      throw new Error('Street address line 1 is required');
    }

    if (components.streetLine1.length > 100) {
      throw new Error('Street address line 1 cannot exceed 100 characters');
    }

    if (components.streetLine2 && components.streetLine2.length > 100) {
      throw new Error('Street address line 2 cannot exceed 100 characters');
    }

    if (!components.city || components.city.trim().length === 0) {
      throw new Error('City is required');
    }

    if (components.city.length > 50) {
      throw new Error('City cannot exceed 50 characters');
    }

    if (!components.state || components.state.trim().length === 0) {
      throw new Error('State/Province is required');
    }

    if (components.state.length > 50) {
      throw new Error('State/Province cannot exceed 50 characters');
    }

    if (!components.postalCode || components.postalCode.trim().length === 0) {
      throw new Error('Postal/ZIP code is required');
    }

    if (components.postalCode.length > 20) {
      throw new Error('Postal/ZIP code cannot exceed 20 characters');
    }

    if (!components.country || components.country.trim().length === 0) {
      throw new Error('Country is required');
    }

    if (components.country.length > 2) {
      throw new Error('Country must be a 2-letter ISO code (e.g., US, CA, GB)');
    }

    if (components.company && components.company.length > 100) {
      throw new Error('Company name cannot exceed 100 characters');
    }

    // Validate postal code format based on country
    this.validatePostalCode(components.postalCode, components.country);
  }

  private validatePostalCode(postalCode: string, country: string): void {
    const patterns: { [key: string]: RegExp } = {
      'US': /^\d{5}(-\d{4})?$/,           // 12345 or 12345-6789
      'CA': /^[A-Z]\d[A-Z] \d[A-Z]\d$/,   // K1A 0A6
      'GB': /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/i, // SW1A 1AA
      'DE': /^\d{5}$/,                    // 12345
      'FR': /^\d{5}$/,                    // 12345
      'JP': /^\d{3}-\d{4}$/,              // 123-4567
      'AU': /^\d{4}$/,                    // 1234
    };

    const pattern = patterns[country.toUpperCase()];
    if (pattern && !pattern.test(postalCode)) {
      throw new Error(`Invalid postal code format for ${country}`);
    }
  }

  equals(other: Address): boolean {
    return (
      this._streetLine1 === other._streetLine1 &&
      this._streetLine2 === other._streetLine2 &&
      this._city === other._city &&
      this._state === other._state &&
      this._postalCode === other._postalCode &&
      this._country === other._country &&
      this._company === other._company
    );
  }

  toString(): string {
    const parts = [
      this._company,
      this._streetLine1,
      this._streetLine2,
      `${this._city}, ${this._state} ${this._postalCode}`,
      this.getCountryName()
    ].filter(Boolean);

    return parts.join('\n');
  }

  // Static factory methods
  static of(components: AddressComponents): Address {
    return new Address(components);
  }

  static createUS(
    streetLine1: string,
    city: string,
    state: string,
    zipCode: string,
    streetLine2?: string,
    company?: string
  ): Address {
    return new Address({
      streetLine1,
      streetLine2,
      city,
      state,
      postalCode: zipCode,
      country: 'US',
      company
    });
  }

  static createCA(
    streetLine1: string,
    city: string,
    province: string,
    postalCode: string,
    streetLine2?: string,
    company?: string
  ): Address {
    return new Address({
      streetLine1,
      streetLine2,
      city,
      state: province,
      postalCode,
      country: 'CA',
      company
    });
  }

  // Utility methods
  toObject(): AddressComponents {
    return {
      streetLine1: this._streetLine1,
      streetLine2: this._streetLine2,
      city: this._city,
      state: this._state,
      postalCode: this._postalCode,
      country: this._country,
      company: this._company
    };
  }

  toSingleLine(): string {
    const parts = [
      this._streetLine1,
      this._streetLine2,
      this._city,
      this._state,
      this._postalCode,
      this.getCountryName()
    ].filter(Boolean);

    return parts.join(', ');
  }

  getCountryName(): string {
    const countryMap: { [key: string]: string } = {
      'US': 'United States',
      'CA': 'Canada',
      'GB': 'United Kingdom',
      'DE': 'Germany',
      'FR': 'France',
      'IT': 'Italy',
      'ES': 'Spain',
      'JP': 'Japan',
      'CN': 'China',
      'IN': 'India',
      'BR': 'Brazil',
      'AU': 'Australia',
      'MX': 'Mexico'
    };

    return countryMap[this._country] || this._country;
  }

  isUS(): boolean {
    return this._country === 'US';
  }

  isCanada(): boolean {
    return this._country === 'CA';
  }

  isInternational(): boolean {
    return !this.isUS() && !this.isCanada();
  }

  hasCompany(): boolean {
    return !!this._company;
  }

  getFullStreetAddress(): string {
    return this._streetLine2
      ? `${this._streetLine1}, ${this._streetLine2}`
      : this._streetLine1;
  }

  getCityStateZip(): string {
    return `${this._city}, ${this._state} ${this._postalCode}`;
  }
}
