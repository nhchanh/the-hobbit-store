/**
 * Customer Domain Value Objects
 * Immutable value objects for customer-related concepts
 */

import { Id } from '../shared/Id';
import { Email, PhoneNumber } from '../shared/Id';

// Customer ID value object
export class CustomerId {
  private readonly _value: Id;

  constructor(value: Id) {
    this._value = value;
  }

  get value(): Id {
    return this._value;
  }

  equals(other: CustomerId): boolean {
    return this._value.equals(other._value);
  }

  toString(): string {
    return this._value.toString();
  }

  static of(value: string): CustomerId {
    return new CustomerId(Id.of(value));
  }

  static random(): CustomerId {
    return new CustomerId(Id.random());
  }
}

// Customer Name value object
export class CustomerName {
  private readonly _firstName: string;
  private readonly _lastName: string;

  constructor(firstName: string, lastName: string) {
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name cannot be empty');
    }
    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Last name cannot be empty');
    }
    if (firstName.length > 50) {
      throw new Error('First name cannot exceed 50 characters');
    }
    if (lastName.length > 50) {
      throw new Error('Last name cannot exceed 50 characters');
    }

    this._firstName = firstName.trim();
    this._lastName = lastName.trim();
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get initials(): string {
    return `${this._firstName.charAt(0)}${this._lastName.charAt(0)}`.toUpperCase();
  }

  get displayName(): string {
    return this.fullName;
  }

  equals(other: CustomerName): boolean {
    return this._firstName === other._firstName && this._lastName === other._lastName;
  }

  toString(): string {
    return this.fullName;
  }

  static of(firstName: string, lastName: string): CustomerName {
    return new CustomerName(firstName, lastName);
  }
}

// Address value object
export class Address {
  private readonly _street: string;
  private readonly _city: string;
  private readonly _state: string;
  private readonly _zipCode: string;
  private readonly _country: string;

  constructor(
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string = 'USA'
  ) {
    if (!street || street.trim().length === 0) {
      throw new Error('Street cannot be empty');
    }
    if (!city || city.trim().length === 0) {
      throw new Error('City cannot be empty');
    }
    if (!state || state.trim().length === 0) {
      throw new Error('State cannot be empty');
    }
    if (!zipCode || zipCode.trim().length === 0) {
      throw new Error('Zip code cannot be empty');
    }
    if (!country || country.trim().length === 0) {
      throw new Error('Country cannot be empty');
    }

    // Validate zip code format (basic US format)
    if (country.toLowerCase() === 'usa' || country.toLowerCase() === 'us') {
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (!zipRegex.test(zipCode.trim())) {
        throw new Error('Invalid US zip code format');
      }
    }

    this._street = street.trim();
    this._city = city.trim();
    this._state = state.trim();
    this._zipCode = zipCode.trim();
    this._country = country.trim();
  }

  get street(): string {
    return this._street;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  get country(): string {
    return this._country;
  }

  get formatted(): string {
    return `${this._street}\n${this._city}, ${this._state} ${this._zipCode}\n${this._country}`;
  }

  get oneLine(): string {
    return `${this._street}, ${this._city}, ${this._state} ${this._zipCode}, ${this._country}`;
  }

  get cityStateZip(): string {
    return `${this._city}, ${this._state} ${this._zipCode}`;
  }

  equals(other: Address): boolean {
    return (
      this._street === other._street &&
      this._city === other._city &&
      this._state === other._state &&
      this._zipCode === other._zipCode &&
      this._country === other._country
    );
  }

  toString(): string {
    return this.oneLine;
  }

  static of(
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country?: string
  ): Address {
    return new Address(street, city, state, zipCode, country);
  }
}

// Customer Preferences value object
export class CustomerPreferences {
  private readonly _language: string;
  private readonly _currency: string;
  private readonly _timezone: string;
  private readonly _marketingEmails: boolean;
  private readonly _notifications: boolean;

  constructor(
    language: string = 'en',
    currency: string = 'USD',
    timezone: string = 'America/New_York',
    marketingEmails: boolean = true,
    notifications: boolean = true
  ) {
    // Validate language code (ISO 639-1)
    if (!/^[a-z]{2}$/.test(language)) {
      throw new Error('Language must be a valid ISO 639-1 code (e.g., en, es, fr)');
    }

    // Validate currency code (ISO 4217)
    if (!/^[A-Z]{3}$/.test(currency)) {
      throw new Error('Currency must be a valid ISO 4217 code (e.g., USD, EUR, GBP)');
    }

    this._language = language;
    this._currency = currency;
    this._timezone = timezone;
    this._marketingEmails = marketingEmails;
    this._notifications = notifications;
  }

  get language(): string {
    return this._language;
  }

  get currency(): string {
    return this._currency;
  }

  get timezone(): string {
    return this._timezone;
  }

  get marketingEmails(): boolean {
    return this._marketingEmails;
  }

  get notifications(): boolean {
    return this._notifications;
  }

  withLanguage(language: string): CustomerPreferences {
    return new CustomerPreferences(
      language,
      this._currency,
      this._timezone,
      this._marketingEmails,
      this._notifications
    );
  }

  withCurrency(currency: string): CustomerPreferences {
    return new CustomerPreferences(
      this._language,
      currency,
      this._timezone,
      this._marketingEmails,
      this._notifications
    );
  }

  withMarketingEmails(enabled: boolean): CustomerPreferences {
    return new CustomerPreferences(
      this._language,
      this._currency,
      this._timezone,
      enabled,
      this._notifications
    );
  }

  withNotifications(enabled: boolean): CustomerPreferences {
    return new CustomerPreferences(
      this._language,
      this._currency,
      this._timezone,
      this._marketingEmails,
      enabled
    );
  }

  equals(other: CustomerPreferences): boolean {
    return (
      this._language === other._language &&
      this._currency === other._currency &&
      this._timezone === other._timezone &&
      this._marketingEmails === other._marketingEmails &&
      this._notifications === other._notifications
    );
  }

  toString(): string {
    return JSON.stringify({
      language: this._language,
      currency: this._currency,
      timezone: this._timezone,
      marketingEmails: this._marketingEmails,
      notifications: this._notifications,
    });
  }

  static of(
    language?: string,
    currency?: string,
    timezone?: string,
    marketingEmails?: boolean,
    notifications?: boolean
  ): CustomerPreferences {
    return new CustomerPreferences(language, currency, timezone, marketingEmails, notifications);
  }

  static default(): CustomerPreferences {
    return new CustomerPreferences();
  }
}
