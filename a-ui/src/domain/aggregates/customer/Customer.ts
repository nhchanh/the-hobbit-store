/**
 * Customer Aggregate Root
 * Following DDD principles - main aggregate for customer management
 */

import { CustomerId, CustomerName } from '../../valueobjects/customer/CustomerValues';
import { Email } from '../../valueobjects/shared/Email';
import { PhoneNumber } from '../../valueobjects/shared/PhoneNumber';
import { CreatedAt, UpdatedAt } from '../../valueobjects/shared/Timestamps';
import { CustomerDomainError } from '../../errors/DomainErrors';

// Customer Address entity within the aggregate
export interface CustomerAddress {
  id: string;
  customerId: CustomerId;
  type: 'BILLING' | 'SHIPPING' | 'BOTH';
  firstName: string;
  lastName: string;
  company?: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: PhoneNumber;
  isDefault: boolean;
}

// Customer Preferences value object
export interface CustomerPreferences {
  currency: string;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  newsletter: boolean;
}

export class Customer {
  private constructor(
    private readonly _id: CustomerId,
    private _firstName: string,
    private _lastName: string,
    private _email: Email,
    private _phoneNumber: PhoneNumber | undefined,
    private _dateOfBirth: Date | undefined,
    private _gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | undefined,
    private _status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
    private _addresses: CustomerAddress[],
    private _preferences: CustomerPreferences,
    private _loyaltyPoints: number,
    private _membershipTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM',
    private readonly _createdAt: CreatedAt,
    private _updatedAt: UpdatedAt,
  ) {}

  // Factory method for creating new customer
  static create(
    firstName: string,
    lastName: string,
    email: Email,
    phoneNumber?: PhoneNumber
  ): Customer {
    const now = new Date();
    return new Customer(
      CustomerId.random(),
      firstName,
      lastName,
      email,
      phoneNumber,
      undefined,
      undefined,
      'ACTIVE',
      [],
      {
        currency: 'USD',
        language: 'en',
        timezone: 'UTC',
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
        newsletter: false,
      },
      0,
      'BRONZE',
      CreatedAt.of(now),
      UpdatedAt.of(now),
    );
  }

  // Factory method for reconstituting from persistence
  static reconstitute(
    id: CustomerId,
    firstName: string,
    lastName: string,
    email: Email,
    phoneNumber: PhoneNumber | undefined,
    dateOfBirth: Date | undefined,
    gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | undefined,
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
    addresses: CustomerAddress[],
    preferences: CustomerPreferences,
    loyaltyPoints: number,
    membershipTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM',
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
  ): Customer {
    return new Customer(
      id,
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth,
      gender,
      status,
      addresses,
      preferences,
      loyaltyPoints,
      membershipTier,
      createdAt,
      updatedAt,
    );
  }

  // Business logic: Update customer information
  updatePersonalInfo(
    firstName?: string,
    lastName?: string,
    phoneNumber?: PhoneNumber,
    dateOfBirth?: Date,
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  ): void {
    if (firstName) this._firstName = firstName;
    if (lastName) this._lastName = lastName;
    if (phoneNumber) this._phoneNumber = phoneNumber;
    if (dateOfBirth) this._dateOfBirth = dateOfBirth;
    if (gender) this._gender = gender;

    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Add address
  addAddress(address: Omit<CustomerAddress, 'id' | 'customerId'>): void {
    // If this is the first address or marked as default, make it default
    const isFirstAddress = this._addresses.length === 0;
    const shouldBeDefault = isFirstAddress || address.isDefault;

    // If setting as default, unset other defaults
    if (shouldBeDefault) {
      this._addresses.forEach(addr => addr.isDefault = false);
    }

    const newAddress: CustomerAddress = {
      id: this.generateAddressId(),
      customerId: this._id,
      ...address,
      isDefault: shouldBeDefault,
    };

    this._addresses.push(newAddress);
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Update address
  updateAddress(addressId: string, updates: Partial<Omit<CustomerAddress, 'id' | 'customerId'>>): void {
    const addressIndex = this._addresses.findIndex(addr => addr.id === addressId);
    if (addressIndex === -1) {
      throw new CustomerDomainError('Address not found');
    }

    // If setting as default, unset other defaults
    if (updates.isDefault) {
      this._addresses.forEach(addr => addr.isDefault = false);
    }

    this._addresses[addressIndex] = {
      ...this._addresses[addressIndex],
      ...updates,
    };

    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Remove address
  removeAddress(addressId: string): void {
    const addressIndex = this._addresses.findIndex(addr => addr.id === addressId);
    if (addressIndex === -1) {
      throw new CustomerDomainError('Address not found');
    }

    const removedAddress = this._addresses[addressIndex];
    this._addresses.splice(addressIndex, 1);

    // If removed address was default and there are other addresses, make the first one default
    if (removedAddress.isDefault && this._addresses.length > 0) {
      this._addresses[0].isDefault = true;
    }

    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Update preferences
  updatePreferences(preferences: Partial<CustomerPreferences>): void {
    this._preferences = {
      ...this._preferences,
      ...preferences,
    };
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Award loyalty points
  awardLoyaltyPoints(points: number): void {
    if (points < 0) {
      throw new CustomerDomainError('Cannot award negative points');
    }

    this._loyaltyPoints += points;
    this.updateMembershipTier();
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Redeem loyalty points
  redeemLoyaltyPoints(points: number): void {
    if (points < 0) {
      throw new CustomerDomainError('Cannot redeem negative points');
    }

    if (points > this._loyaltyPoints) {
      throw new CustomerDomainError('Insufficient loyalty points');
    }

    this._loyaltyPoints -= points;
    this.updateMembershipTier();
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Suspend customer
  suspend(): void {
    if (this._status === 'SUSPENDED') {
      throw new CustomerDomainError('Customer is already suspended');
    }

    this._status = 'SUSPENDED';
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Activate customer
  activate(): void {
    this._status = 'ACTIVE';
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Business logic: Deactivate customer
  deactivate(): void {
    this._status = 'INACTIVE';
    this._updatedAt = UpdatedAt.of(new Date());
  }

  // Private helper methods
  private updateMembershipTier(): void {
    if (this._loyaltyPoints >= 10000) {
      this._membershipTier = 'PLATINUM';
    } else if (this._loyaltyPoints >= 5000) {
      this._membershipTier = 'GOLD';
    } else if (this._loyaltyPoints >= 1000) {
      this._membershipTier = 'SILVER';
    } else {
      this._membershipTier = 'BRONZE';
    }
  }

  private generateAddressId(): string {
    return `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Getters (immutable access)
  get id(): CustomerId { return this._id; }
  get firstName(): string { return this._firstName; }
  get lastName(): string { return this._lastName; }
  get fullName(): string { return `${this._firstName} ${this._lastName}`; }
  get email(): Email { return this._email; }
  get phoneNumber(): PhoneNumber | undefined { return this._phoneNumber; }
  get dateOfBirth(): Date | undefined { return this._dateOfBirth; }
  get gender(): 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | undefined { return this._gender; }
  get status(): 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' { return this._status; }
  get addresses(): readonly CustomerAddress[] { return Object.freeze([...this._addresses]); }
  get preferences(): CustomerPreferences { return { ...this._preferences }; }
  get loyaltyPoints(): number { return this._loyaltyPoints; }
  get membershipTier(): 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' { return this._membershipTier; }
  get createdAt(): CreatedAt { return this._createdAt; }
  get updatedAt(): UpdatedAt { return this._updatedAt; }
  get isActive(): boolean { return this._status === 'ACTIVE'; }
  get isSuspended(): boolean { return this._status === 'SUSPENDED'; }
  get defaultAddress(): CustomerAddress | undefined {
    return this._addresses.find(addr => addr.isDefault);
  }
  get hasAddresses(): boolean { return this._addresses.length > 0; }
}
