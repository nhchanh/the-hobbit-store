/**
 * Base API Client
 * Provides common functionality for API communication
 */

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
  success: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  status: number;
}

export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = '/api', timeout: number = 10000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, params);
    return this.request<T>('GET', url);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint);
    return this.request<T>('POST', url, data);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint);
    return this.request<T>('PUT', url, data);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint);
    return this.request<T>('DELETE', url);
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint);
    return this.request<T>('PATCH', url, data);
  }

  /**
   * Core request method
   */
  private async request<T>(
    method: string,
    url: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        signal: AbortSignal.timeout(this.timeout),
      };

      if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      const result = await response.json();
      return result as ApiResponse<T>;
    } catch (error) {
      if (error instanceof Error) {
        throw this.createApiError(error.message, 0);
      }
      throw error;
    }
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    // Get token from localStorage or secure storage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Handle error responses
   */
  private async handleErrorResponse(response: Response): Promise<ApiError> {
    try {
      const errorData = await response.json();
      return {
        code: errorData.code || 'UNKNOWN_ERROR',
        message: errorData.message || 'An unexpected error occurred',
        details: errorData.details || {},
        status: response.status,
      };
    } catch {
      return this.createApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }
  }

  /**
   * Create standardized API error
   */
  private createApiError(message: string, status: number): ApiError {
    return {
      code: 'API_ERROR',
      message,
      status,
    };
  }
}

// Singleton instance
export const apiClient = new ApiClient();

export default ApiClient;
