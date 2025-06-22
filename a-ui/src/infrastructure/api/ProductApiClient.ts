/**
 * Product API Client
 * Handles HTTP communication with product endpoints
 */

import { ApiClient } from './ApiClient';
import { ProductDto } from '../../application/dto/ProductDto';

// Create temporary interfaces until the DTO file has them
interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  currency: string;
  categoryId: string;
  images?: { url: string; altText: string; isMain?: boolean }[];
  specifications?: { name: string; value: string }[];
  tags?: string[];
}

interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  categoryId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  tags?: string[];
}

export class ProductApiClient extends ApiClient {
  private readonly basePath = '/products';

  /**
   * Get product by ID
   */
  async getById(productId: string): Promise<ProductDto | null> {
    try {
      const response = await this.get<ProductDto>(`${this.basePath}/${productId}`);
      return response.data;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get all products with optional filters
   */
  async getAll(filters?: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{
    data: ProductDto[];
    totalCount: number;
    page: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${this.basePath}?${queryParams.toString()}`
      : this.basePath;

    const response = await this.get<{
      data: ProductDto[];
      totalCount: number;
      page: number;
      limit: number;
    }>(url);

    return response.data;
  }

  /**
   * Search products
   */
  async search(query: string, filters?: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{
    data: ProductDto[];
    totalCount: number;
    page: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams({ q: query });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await this.get<{
      data: ProductDto[];
      totalCount: number;
      page: number;
      limit: number;
    }>(`${this.basePath}/search?${queryParams.toString()}`);

    return response.data;
  }

  /**
   * Get products by category
   */
  async getByCategory(categoryId: string, options?: {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{
    data: ProductDto[];
    totalCount: number;
    page: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams();

    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `${this.basePath}/category/${categoryId}?${queryParams.toString()}`
      : `${this.basePath}/category/${categoryId}`;

    const response = await this.get<{
      data: ProductDto[];
      totalCount: number;
      page: number;
      limit: number;
    }>(url);

    return response.data;
  }

  /**
   * Get featured products
   */
  async getFeatured(limit: number = 10): Promise<ProductDto[]> {
    const response = await this.get<ProductDto[]>(`${this.basePath}/featured?limit=${limit}`);
    return response.data;
  }

  /**
   * Get related products
   */
  async getRelated(productId: string, limit: number = 5): Promise<ProductDto[]> {
    const response = await this.get<ProductDto[]>(`${this.basePath}/${productId}/related?limit=${limit}`);
    return response.data;
  }

  /**
   * Create new product
   */
  async create(productData: CreateProductDto): Promise<ProductDto> {
    const response = await this.post<ProductDto>(this.basePath, productData);
    return response.data;
  }

  /**
   * Update existing product
   */
  async update(productId: string, updateData: UpdateProductDto): Promise<ProductDto> {
    const response = await this.put<ProductDto>(`${this.basePath}/${productId}`, updateData);
    return response.data;
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: string): Promise<void> {
    await this.delete<void>(`${this.basePath}/${productId}`);
  }

  /**
   * Upload product image
   */
  async uploadImage(productId: string, imageFile: File, metadata?: {
    altText?: string;
    displayOrder?: number;
    isMain?: boolean;
  }): Promise<{ imageId: string; url: string }> {
    // For now, this is a placeholder - actual implementation would use FormData
    // and a different content type
    const imageData = {
      fileName: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
      ...metadata
    };

    const response = await this.post<{ imageId: string; url: string }>(
      `${this.basePath}/${productId}/images`,
      imageData
    );
    return response.data;
  }

  /**
   * Delete product image
   */
  async deleteImage(productId: string, imageId: string): Promise<void> {
    await this.delete<void>(`${this.basePath}/${productId}/images/${imageId}`);
  }
}
