/**
 * Global TypeScript type definitions
 */

// Environment types
export type Environment = 'development' | 'testing' | 'staging' | 'production';

export interface EnvironmentConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  enableDevTools: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// Tenant context
export interface TenantContext {
  tenantId: string;
  environmentId: string;
  name: string;
  locale: string;
  currency: string;
  timezone: string;
}

// Common UI types
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SortCriteria {
  field: string;
  direction: 'asc' | 'desc';
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// Lifecycle states
export enum ApplicationState {
  INIT = 'init',
  HYDRATING = 'hydrating',
  IDLE = 'idle',
  LOADING = 'loading',
  REFRESHING = 'refreshing',
  REVALIDATING = 'revalidating',
  SUBMITTING = 'submitting',
  PROCESSING = 'processing',
  OPTIMISTIC = 'optimistic',
  SUCCESS = 'success',
  ERROR = 'error',
  NAVIGATING = 'navigating',
  SUSPENDED = 'suspended',
  OFFLINE = 'offline',
  RECONNECTING = 'reconnecting',
}

// Loading states for async operations
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

// Base interface for async state management
export interface AsyncState {
  loading: LoadingState;
  error: string | null;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  permissions?: string[];
}

// Form types
export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: FormFieldError[];
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Currency and Money
export interface CurrencyInfo {
  code: string; // ISO 4217 currency code
  symbol: string;
  name: string;
  decimalPlaces: number;
}

// Image types
export interface ImageInfo {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  placeholder?: string;
}

// Search and Filter types
export interface SearchCriteria {
  query: string;
  filters: Record<string, any>;
  sort: SortCriteria[];
  pagination: Pick<PaginationMeta, 'page' | 'pageSize'>;
}

export interface FilterOption {
  id: string;
  name: string;
  type: 'checkbox' | 'radio' | 'range' | 'select';
  options?: SelectOption[];
  min?: number;
  max?: number;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

// Analytics and tracking
export interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}
