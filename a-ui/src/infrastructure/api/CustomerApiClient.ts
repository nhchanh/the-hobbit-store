import { ApiClient } from './ApiClient';
import { CustomerDto, AddressDto, CustomerPreferencesDto } from '../../application/dto/CustomerDto';

export interface ICustomerApiClient {
  // Customer CRUD operations
  getCustomer(customerId: string): Promise<CustomerDto>;
  createCustomer(customerData: CreateCustomerRequest): Promise<CustomerDto>;
  updateCustomer(customerId: string, updates: UpdateCustomerRequest): Promise<CustomerDto>;
  deleteCustomer(customerId: string): Promise<void>;
  listCustomers(filters?: CustomerListFilters): Promise<CustomerDto[]>;

  // Customer profile operations
  updatePersonalInfo(customerId: string, personalInfo: UpdatePersonalInfoRequest): Promise<CustomerDto>;
  changeEmail(customerId: string, newEmail: string): Promise<CustomerDto>;
  changePhoneNumber(customerId: string, newPhoneNumber: string): Promise<CustomerDto>;

  // Address management
  getAddresses(customerId: string): Promise<AddressDto[]>;
  addAddress(customerId: string, address: CreateAddressRequest): Promise<CustomerDto>;
  updateAddress(customerId: string, addressId: string, address: UpdateAddressRequest): Promise<CustomerDto>;
  deleteAddress(customerId: string, addressId: string): Promise<CustomerDto>;
  setDefaultAddress(customerId: string, addressId: string): Promise<CustomerDto>;

  // Preferences management
  getPreferences(customerId: string): Promise<CustomerPreferencesDto>;
  updatePreferences(customerId: string, preferences: UpdatePreferencesRequest): Promise<CustomerDto>;

  // Loyalty management
  awardLoyaltyPoints(customerId: string, points: number, reason: string): Promise<CustomerDto>;
  redeemLoyaltyPoints(customerId: string, points: number, reason: string): Promise<CustomerDto>;
  getLoyaltyHistory(customerId: string): Promise<LoyaltyTransaction[]>;

  // Account management
  suspendCustomer(customerId: string, reason: string): Promise<CustomerDto>;
  reactivateCustomer(customerId: string): Promise<CustomerDto>;
  deactivateCustomer(customerId: string): Promise<CustomerDto>;

  // Search and analytics
  searchCustomers(query: string): Promise<CustomerDto[]>;
  getCustomersByStatus(status: string): Promise<CustomerDto[]>;
  getCustomersByMembershipTier(tier: string): Promise<CustomerDto[]>;
  getCustomerStatistics(customerId: string): Promise<CustomerStatistics>;
}

// Request/Response types
export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
}

export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
}

export interface UpdatePersonalInfoRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
}

export interface CreateAddressRequest {
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
  isDefault?: boolean;
}

export interface UpdateAddressRequest {
  type?: 'BILLING' | 'SHIPPING' | 'BOTH';
  firstName?: string;
  lastName?: string;
  company?: string;
  streetLine1?: string;
  streetLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phoneNumber?: string;
  isDefault?: boolean;
}

export interface UpdatePreferencesRequest {
  currency?: string;
  language?: string;
  timezone?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  marketingEmails?: boolean;
  newsletter?: boolean;
}

export interface CustomerListFilters {
  status?: string;
  membershipTier?: string;
  dateFrom?: string;
  dateTo?: string;
  hasOrders?: boolean;
  loyaltyPointsMin?: number;
  loyaltyPointsMax?: number;
  page?: number;
  limit?: number;
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  type: 'EARNED' | 'REDEEMED';
  points: number;
  reason: string;
  referenceId?: string;
  createdAt: string;
}

export interface CustomerStatistics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  loyaltyPointsBalance: number;
  membershipTier: string;
  joinDate: string;
  preferredCategories: string[];
}

/**
 * Customer API Client Implementation
 * Handles all customer-related API operations
 */
export class CustomerApiClient extends ApiClient implements ICustomerApiClient {
  private readonly basePath = '/api/customers';

  async getCustomer(customerId: string): Promise<CustomerDto> {
    const response = await this.get<CustomerDto>(`${this.basePath}/${customerId}`);
    return response.data;
  }

  async createCustomer(customerData: CreateCustomerRequest): Promise<CustomerDto> {
    const response = await this.post<CustomerDto>(this.basePath, customerData);
    return response.data;
  }

  async updateCustomer(customerId: string, updates: UpdateCustomerRequest): Promise<CustomerDto> {
    const response = await this.put<CustomerDto>(`${this.basePath}/${customerId}`, updates);
    return response.data;
  }

  async deleteCustomer(customerId: string): Promise<void> {
    await this.delete(`${this.basePath}/${customerId}`);
  }

  async listCustomers(filters?: CustomerListFilters): Promise<CustomerDto[]> {
    const query = filters ? this.buildQueryString(filters) : '';
    const response = await this.get<CustomerDto[]>(`${this.basePath}${query}`);
    return response.data;
  }

  async updatePersonalInfo(customerId: string, personalInfo: UpdatePersonalInfoRequest): Promise<CustomerDto> {
    const response = await this.patch<CustomerDto>(`${this.basePath}/${customerId}/personal-info`, personalInfo);
    return response.data;
  }

  async changeEmail(customerId: string, newEmail: string): Promise<CustomerDto> {
    const response = await this.patch<CustomerDto>(`${this.basePath}/${customerId}/email`, { email: newEmail });
    return response.data;
  }

  async changePhoneNumber(customerId: string, newPhoneNumber: string): Promise<CustomerDto> {
    const response = await this.patch<CustomerDto>(`${this.basePath}/${customerId}/phone`, { phoneNumber: newPhoneNumber });
    return response.data;
  }

  async getAddresses(customerId: string): Promise<AddressDto[]> {
    const response = await this.get<AddressDto[]>(`${this.basePath}/${customerId}/addresses`);
    return response.data;
  }

  async addAddress(customerId: string, address: CreateAddressRequest): Promise<CustomerDto> {
    const response = await this.post<CustomerDto>(`${this.basePath}/${customerId}/addresses`, address);
    return response.data;
  }

  async updateAddress(customerId: string, addressId: string, address: UpdateAddressRequest): Promise<CustomerDto> {
    const response = await this.put<CustomerDto>(`${this.basePath}/${customerId}/addresses/${addressId}`, address);
    return response.data;
  }

  async deleteAddress(customerId: string, addressId: string): Promise<CustomerDto> {
    const response = await this.delete<CustomerDto>(`${this.basePath}/${customerId}/addresses/${addressId}`);
    return response.data;
  }

  async setDefaultAddress(customerId: string, addressId: string): Promise<CustomerDto> {
    const response = await this.patch<CustomerDto>(`${this.basePath}/${customerId}/addresses/${addressId}/default`, {});
    return response.data;
  }

  async getPreferences(customerId: string): Promise<CustomerPreferencesDto> {
    const response = await this.get<CustomerPreferencesDto>(`${this.basePath}/${customerId}/preferences`);
    return response.data;
  }

  async updatePreferences(customerId: string, preferences: UpdatePreferencesRequest): Promise<CustomerDto> {
    const response = await this.put<CustomerDto>(`${this.basePath}/${customerId}/preferences`, preferences);
    return response.data;
  }

  async awardLoyaltyPoints(customerId: string, points: number, reason: string): Promise<CustomerDto> {
    const response = await this.post<CustomerDto>(`${this.basePath}/${customerId}/loyalty/award`, {
      points,
      reason
    });
    return response.data;
  }

  async redeemLoyaltyPoints(customerId: string, points: number, reason: string): Promise<CustomerDto> {
    const response = await this.post<CustomerDto>(`${this.basePath}/${customerId}/loyalty/redeem`, {
      points,
      reason
    });
    return response.data;
  }

  async getLoyaltyHistory(customerId: string): Promise<LoyaltyTransaction[]> {
    const response = await this.get<LoyaltyTransaction[]>(`${this.basePath}/${customerId}/loyalty/history`);
    return response.data;
  }

  async suspendCustomer(customerId: string, reason: string): Promise<CustomerDto> {
    const response = await this.patch<CustomerDto>(`${this.basePath}/${customerId}/suspend`, { reason });
    return response.data;
  }

  async reactivateCustomer(customerId: string): Promise<CustomerDto> {
    const response = await this.patch<CustomerDto>(`${this.basePath}/${customerId}/reactivate`, {});
    return response.data;
  }

  async deactivateCustomer(customerId: string): Promise<CustomerDto> {
    const response = await this.patch<CustomerDto>(`${this.basePath}/${customerId}/deactivate`, {});
    return response.data;
  }

  async searchCustomers(query: string): Promise<CustomerDto[]> {
    const response = await this.get<CustomerDto[]>(`${this.basePath}/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  async getCustomersByStatus(status: string): Promise<CustomerDto[]> {
    const response = await this.get<CustomerDto[]>(`${this.basePath}?status=${status}`);
    return response.data;
  }

  async getCustomersByMembershipTier(tier: string): Promise<CustomerDto[]> {
    const response = await this.get<CustomerDto[]>(`${this.basePath}?membershipTier=${tier}`);
    return response.data;
  }

  async getCustomerStatistics(customerId: string): Promise<CustomerStatistics> {
    const response = await this.get<CustomerStatistics>(`${this.basePath}/${customerId}/statistics`);
    return response.data;
  }

  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }
}

// Export singleton instance
export const customerApiClient = new CustomerApiClient();
