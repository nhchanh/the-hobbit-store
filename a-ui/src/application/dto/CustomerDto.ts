/**
 * Customer Data Transfer Objects
 * Used for API communication and Redux state
 */

import { ProductDto } from './ProductDto';

export interface CustomerDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  addresses: AddressDto[];
  preferences: CustomerPreferencesDto;
  loyaltyPoints: number;
  membershipTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  createdAt: string;
  updatedAt: string;
}

export interface AddressDto {
  id: string;
  customerId: string;
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
  phoneNumber?: string;
  isDefault: boolean;
}

export interface CustomerPreferencesDto {
  currency: string;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  newsletter: boolean;
}

export interface WishlistDto {
  id: string;
  customerId: string;
  name: string;
  isPublic: boolean;
  items: WishlistItemDto[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItemDto {
  id: string;
  wishlistId: string;
  productId: string;
  product: ProductDto;
  addedAt: string;
  notes?: string;
}

export interface CustomerRegistrationDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  acceptTerms: boolean;
  subscribeNewsletter?: boolean;
}

export interface CustomerUpdateDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  preferences?: Partial<CustomerPreferencesDto>;
}

export interface CustomerLoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface CustomerAuthResponseDto {
  customer: CustomerDto;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
