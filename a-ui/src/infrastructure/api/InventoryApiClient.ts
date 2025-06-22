/**
 * Inventory API Client
 * Handles all inventory-related API operations
 */

import { ApiClient, ApiResponse } from './ApiClient';
import {
  InventoryDto,
  CreateInventoryDto,
  UpdateInventoryStockDto,
  RestockInventoryDto,
  InventorySearchDto,
  InventorySummaryDto,
  BulkInventoryUpdateDto,
  InventoryMovementDto
} from '../../application/dto/InventoryDto';

export class InventoryApiClient {
  private apiClient: ApiClient;

  constructor(apiClient?: ApiClient) {
    this.apiClient = apiClient || new ApiClient();
  }

  /**
   * Create new inventory record
   */
  async createInventory(data: CreateInventoryDto): Promise<InventoryDto> {
    const response = await this.apiClient.post<InventoryDto>('/inventory', data);
    return response.data;
  }

  /**
   * Get inventory by product ID
   */
  async getInventoryByProductId(productId: string): Promise<InventoryDto | null> {
    try {
      const response = await this.apiClient.get<InventoryDto>(`/inventory/product/${productId}`);
      return response.data;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get inventory by ID
   */
  async getInventoryById(inventoryId: string): Promise<InventoryDto> {
    const response = await this.apiClient.get<InventoryDto>(`/inventory/${inventoryId}`);
    return response.data;
  }

  /**
   * Update inventory stock
   */
  async updateStock(productId: string, data: UpdateInventoryStockDto): Promise<InventoryDto> {
    const response = await this.apiClient.put<InventoryDto>(
      `/inventory/product/${productId}/stock`,
      data
    );
    return response.data;
  }

  /**
   * Restock inventory
   */
  async restockInventory(productId: string, data: RestockInventoryDto): Promise<InventoryDto> {
    const response = await this.apiClient.post<InventoryDto>(
      `/inventory/product/${productId}/restock`,
      data
    );
    return response.data;
  }

  /**
   * Search inventory
   */
  async searchInventory(criteria: InventorySearchDto): Promise<InventoryDto[]> {
    const response = await this.apiClient.get<InventoryDto[]>('/inventory/search', criteria);
    return response.data;
  }

  /**
   * Get low stock items
   */
  async getLowStockItems(): Promise<InventoryDto[]> {
    const response = await this.apiClient.get<InventoryDto[]>('/inventory/low-stock');
    return response.data;
  }

  /**
   * Get inventory summary
   */
  async getInventorySummary(): Promise<InventorySummaryDto> {
    const response = await this.apiClient.get<InventorySummaryDto>('/inventory/summary');
    return response.data;
  }

  /**
   * Bulk update inventory
   */
  async bulkUpdateInventory(data: BulkInventoryUpdateDto): Promise<InventoryDto[]> {
    const response = await this.apiClient.post<InventoryDto[]>('/inventory/bulk-update', data);
    return response.data;
  }

  /**
   * Get inventory movements/history
   */
  async getInventoryMovements(
    productId: string,
    params?: {
      startDate?: string;
      endDate?: string;
      movementType?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<InventoryMovementDto[]> {
    const response = await this.apiClient.get<InventoryMovementDto[]>(
      `/inventory/product/${productId}/movements`,
      params
    );
    return response.data;
  }

  /**
   * Update inventory location
   */
  async updateLocation(productId: string, locationCode: string): Promise<InventoryDto> {
    const response = await this.apiClient.patch<InventoryDto>(
      `/inventory/product/${productId}/location`,
      { locationCode }
    );
    return response.data;
  }

  /**
   * Update restock threshold
   */
  async updateRestockThreshold(productId: string, threshold: number): Promise<InventoryDto> {
    const response = await this.apiClient.patch<InventoryDto>(
      `/inventory/product/${productId}/threshold`,
      { restockThreshold: threshold }
    );
    return response.data;
  }

  /**
   * Mark inventory as discontinued
   */
  async markAsDiscontinued(productId: string): Promise<InventoryDto> {
    const response = await this.apiClient.patch<InventoryDto>(
      `/inventory/product/${productId}/discontinue`,
      {}
    );
    return response.data;
  }

  /**
   * Delete inventory record
   */
  async deleteInventory(productId: string): Promise<void> {
    await this.apiClient.delete(`/inventory/product/${productId}`);
  }
}

// Singleton instance
export const inventoryApi = new InventoryApiClient();

export default InventoryApiClient;
