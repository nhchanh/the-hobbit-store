/**
 * Customer Domain Hook
 * Manages customer operations following DDD principles
 */

import { useCallback } from 'react';
import { ApplicationState } from '../../types/common';
import { CustomerDto, CreateCustomerRequest } from '../../types/api';

// Mock hooks for now - would be real Redux hooks
const useAppSelector = (selector: any) => selector({
  customer: {
    currentCustomer: null,
    customerProfile: null,
    state: ApplicationState.IDLE,
    isLoading: false,
    isUpdating: false,
    preferences: null,
  }
});
const useAppDispatch = () => (action: any) => console.log('Dispatch:', action);

export const useCustomer = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const currentCustomer = useAppSelector((state: any) => state.customer.currentCustomer);
  const customerProfile = useAppSelector((state: any) => state.customer.customerProfile);
  const customerState = useAppSelector((state: any) => state.customer.state);
  const isLoading = useAppSelector((state: any) => state.customer.isLoading);
  const isUpdating = useAppSelector((state: any) => state.customer.isUpdating);
  const preferences = useAppSelector((state: any) => state.customer.preferences);

  // Customer operations
  const fetchCustomer = useCallback(async (customerId: string) => {
    dispatch({
      type: 'customer/fetchCustomer',
      payload: customerId,
    });
  }, [dispatch]);

  const createCustomer = useCallback(async (customerData: CreateCustomerRequest) => {
    dispatch({
      type: 'customer/createCustomer',
      payload: customerData,
    });
  }, [dispatch]);

  const updateCustomer = useCallback(async (customerId: string, customerData: Partial<CustomerDto>) => {
    dispatch({
      type: 'customer/updateCustomer',
      payload: { customerId, customerData },
    });
  }, [dispatch]);

  const updateProfile = useCallback(async (profileData: Partial<CustomerDto>) => {
    if (!currentCustomer) {
      throw new Error('No customer logged in');
    }

    dispatch({
      type: 'customer/updateProfile',
      payload: profileData,
    });
  }, [dispatch, currentCustomer]);

  const updatePreferences = useCallback(async (newPreferences: any) => {
    if (!currentCustomer) {
      throw new Error('No customer logged in');
    }

    dispatch({
      type: 'customer/updatePreferences',
      payload: newPreferences,
    });
  }, [dispatch, currentCustomer]);

  // Address operations
  const updateAddress = useCallback(async (address: any) => {
    if (!currentCustomer) {
      throw new Error('No customer logged in');
    }

    dispatch({
      type: 'customer/updateAddress',
      payload: address,
    });
  }, [dispatch, currentCustomer]);

  const addAddress = useCallback(async (address: any) => {
    if (!currentCustomer) {
      throw new Error('No customer logged in');
    }

    dispatch({
      type: 'customer/addAddress',
      payload: address,
    });
  }, [dispatch, currentCustomer]);

  const removeAddress = useCallback(async (addressId: string) => {
    if (!currentCustomer) {
      throw new Error('No customer logged in');
    }

    dispatch({
      type: 'customer/removeAddress',
      payload: addressId,
    });
  }, [dispatch, currentCustomer]);

  // Authentication helpers
  const isLoggedIn = useCallback((): boolean => {
    return currentCustomer !== null;
  }, [currentCustomer]);

  const getCustomerId = useCallback((): string | null => {
    return currentCustomer?.id || null;
  }, [currentCustomer]);

  const getCustomerName = useCallback((): string => {
    if (!currentCustomer) return 'Guest';
    return `${currentCustomer.firstName} ${currentCustomer.lastName}`;
  }, [currentCustomer]);

  const getCustomerEmail = useCallback((): string | null => {
    return currentCustomer?.email || null;
  }, [currentCustomer]);

  // Validation helpers
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validatePhoneNumber = useCallback((phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }, []);

  const validateName = useCallback((name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 50;
  }, []);

  // Profile completeness
  const getProfileCompleteness = useCallback((): number => {
    if (!currentCustomer) return 0;

    let completedFields = 0;
    const totalFields = 6; // firstName, lastName, email, phone, address

    if (currentCustomer.firstName) completedFields++;
    if (currentCustomer.lastName) completedFields++;
    if (currentCustomer.email) completedFields++;
    if (currentCustomer.phoneNumber) completedFields++;
    if (currentCustomer.address) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }, [currentCustomer]);

  const isProfileComplete = useCallback((): boolean => {
    return getProfileCompleteness() === 100;
  }, [getProfileCompleteness]);

  // Logout
  const logout = useCallback(() => {
    dispatch({
      type: 'customer/logout',
    });
  }, [dispatch]);

  // Loading states
  const isLoadingCustomer = customerState === ApplicationState.LOADING;

  return {
    // Data
    currentCustomer,
    customerProfile,
    preferences,

    // Operations
    fetchCustomer,
    createCustomer,
    updateCustomer,
    updateProfile,
    updatePreferences,

    // Address operations
    updateAddress,
    addAddress,
    removeAddress,

    // Authentication helpers
    isLoggedIn,
    getCustomerId,
    getCustomerName,
    getCustomerEmail,

    // Validation helpers
    validateEmail,
    validatePhoneNumber,
    validateName,

    // Profile helpers
    getProfileCompleteness,
    isProfileComplete,

    // Auth operations
    logout,

    // State
    isLoading: isLoadingCustomer,
    isUpdating,
    state: customerState,
  };
};

// Specialized hook for customer preferences
export const useCustomerPreferences = () => {
  const { preferences, updatePreferences, currentCustomer } = useCustomer();

  const updateLanguage = useCallback(async (language: string) => {
    await updatePreferences({ ...preferences, language });
  }, [preferences, updatePreferences]);

  const updateCurrency = useCallback(async (currency: string) => {
    await updatePreferences({ ...preferences, currency });
  }, [preferences, updatePreferences]);

  const updateTheme = useCallback(async (theme: string) => {
    await updatePreferences({ ...preferences, theme });
  }, [preferences, updatePreferences]);

  const toggleMarketingEmails = useCallback(async () => {
    const notifications = preferences?.notifications || {};
    await updatePreferences({
      ...preferences,
      notifications: {
        ...notifications,
        marketing: !notifications.marketing,
      },
    });
  }, [preferences, updatePreferences]);

  const toggleNotifications = useCallback(async () => {
    const notifications = preferences?.notifications || {};
    await updatePreferences({
      ...preferences,
      notifications: {
        ...notifications,
        push: !notifications.push,
      },
    });
  }, [preferences, updatePreferences]);

  return {
    preferences,
    updateLanguage,
    updateCurrency,
    updateTheme,
    toggleMarketingEmails,
    toggleNotifications,
    isLoggedIn: !!currentCustomer,
  };
};

// Hook for address management
export const useCustomerAddress = () => {
  const { currentCustomer, updateAddress, addAddress, removeAddress } = useCustomer();

  const addresses = currentCustomer?.addresses || [];
  const primaryAddress = addresses.find((addr: any) => addr.isPrimary) || addresses[0] || null;

  const setPrimaryAddress = useCallback(async (addressId: string) => {
    // Implementation would update the primary address
    console.log('Setting primary address:', addressId);
  }, []);

  const validateAddress = useCallback((address: any): string[] => {
    const errors: string[] = [];

    if (!address.street || address.street.trim().length === 0) {
      errors.push('Street address is required');
    }
    if (!address.city || address.city.trim().length === 0) {
      errors.push('City is required');
    }
    if (!address.state || address.state.trim().length === 0) {
      errors.push('State is required');
    }
    if (!address.zipCode || address.zipCode.trim().length === 0) {
      errors.push('Zip code is required');
    }

    // Validate US zip code format
    if (address.zipCode && !/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
      errors.push('Invalid zip code format');
    }

    return errors;
  }, []);

  return {
    addresses,
    primaryAddress,
    updateAddress,
    addAddress,
    removeAddress,
    setPrimaryAddress,
    validateAddress,
    hasAddresses: addresses.length > 0,
    addressCount: addresses.length,
  };
};
