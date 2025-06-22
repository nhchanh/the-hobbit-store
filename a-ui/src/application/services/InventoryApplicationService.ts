/**
 * Inventory Application Service
 * Orchestrates inventory operations and coordinates between domain and infrastructure
 */

import { Inventory } from '../../domain/aggregates/inventory/Inventory';
import { Id } from '../../domain/valueobjects/shared/Id';
import { StockQuantity, RestockThreshold } from '../../domain/valueobjects/inventory/InventoryValues';
import {
  InventoryDto,
  CreateInventoryDto,
  UpdateInventoryStockDto,
  RestockInventoryDto,
  InventorySearchDto,
  InventorySummaryDto,
  BulkInventoryUpdateDto
} from '../dto/InventoryDto';
import { InventoryMapper } from '../mappers/InventoryMapper';

export class InventoryApplicationService {
  // In a real implementation, these would be injected dependencies
  private inventoryRepository: any; // IInventoryRepository
  private productRepository: any; // IProductRepository
  private eventPublisher: any; // IEventPublisher

  constructor(
    inventoryRepository?: any,
    productRepository?: any,
    eventPublisher?: any
  ) {
    this.inventoryRepository = inventoryRepository;
    this.productRepository = productRepository;
    this.eventPublisher = eventPublisher;
  }

  /**
   * Creates new inventory record for a product
   */
  async createInventory(createDto: CreateInventoryDto): Promise<InventoryDto> {
    try {
      // Validate product exists
      if (this.productRepository) {
        const productExists = await this.productRepository.exists(createDto.productId);
        if (!productExists) {
          throw new Error(`Product with ID ${createDto.productId} not found`);
        }
      }

      // Check if inventory already exists
      if (this.inventoryRepository) {
        const existingInventory = await this.inventoryRepository.findByProductId(createDto.productId);
        if (existingInventory) {
          throw new Error(`Inventory already exists for product ${createDto.productId}`);
        }
      }

      // Create domain aggregate
      const inventory = Inventory.create(
        Id.of(createDto.productId),
        createDto.initialStock,
        createDto.restockThreshold,
        createDto.locationCode
      );

      // Persist to repository
      if (this.inventoryRepository) {
        await this.inventoryRepository.save(inventory);
      }

      // Publish domain event
      if (this.eventPublisher) {
        await this.eventPublisher.publish({
          type: 'InventoryCreated',
          data: {
            productId: createDto.productId,
            initialStock: createDto.initialStock,
            restockThreshold: createDto.restockThreshold,
          },
        });
      }

      return InventoryMapper.toDto(inventory);
    } catch (error) {
      throw new Error(`Failed to create inventory: ${(error as Error).message}`);
    }
  }

  /**
   * Updates stock quantity for an inventory item
   */
  async updateStock(
    productId: string,
    updateDto: UpdateInventoryStockDto
  ): Promise<InventoryDto> {
    try {
      // Load inventory aggregate
      const inventory = await this.loadInventoryByProductId(productId);

      // Determine operation type
      const currentQuantity = inventory.stockQuantity.value();
      const difference = updateDto.newQuantity - currentQuantity;

      let updatedInventory: Inventory;
      if (difference > 0) {
        updatedInventory = inventory.addStock(difference);
      } else if (difference < 0) {
        updatedInventory = inventory.removeStock(Math.abs(difference));
      } else {
        updatedInventory = inventory; // No change
      }

      // Persist changes
      if (this.inventoryRepository) {
        await this.inventoryRepository.save(updatedInventory);
      }

      // Record movement
      await this.recordInventoryMovement(
        updatedInventory,
        difference > 0 ? 'INBOUND' : 'OUTBOUND',
        Math.abs(difference),
        updateDto.reason || 'Stock adjustment',
        undefined,
        updateDto.notes
      );

      // Publish domain event
      if (this.eventPublisher) {
        await this.eventPublisher.publish({
          type: 'StockUpdated',
          data: {
            productId,
            previousQuantity: currentQuantity,
            newQuantity: updateDto.newQuantity,
            reason: updateDto.reason,
          },
        });
      }

      return InventoryMapper.toDto(updatedInventory);
    } catch (error) {
      throw new Error(`Failed to update stock: ${(error as Error).message}`);
    }
  }

  /**
   * Restocks an inventory item
   */
  async restockInventory(
    productId: string,
    restockDto: RestockInventoryDto
  ): Promise<InventoryDto> {
    try {
      // Load inventory aggregate
      const inventory = await this.loadInventoryByProductId(productId);

      // Restock using domain method
      const updatedInventory = inventory.restock(restockDto.additionalQuantity);

      // Persist changes
      if (this.inventoryRepository) {
        await this.inventoryRepository.save(updatedInventory);
      }

      // Record movement
      await this.recordInventoryMovement(
        updatedInventory,
        'INBOUND',
        restockDto.additionalQuantity,
        'Restock',
        undefined,
        restockDto.notes
      );

      // Publish domain event
      if (this.eventPublisher) {
        await this.eventPublisher.publish({
          type: 'InventoryRestocked',
          data: {
            productId,
            additionalQuantity: restockDto.additionalQuantity,
            supplier: restockDto.supplier,
            cost: restockDto.cost,
          },
        });
      }

      return InventoryMapper.toDto(updatedInventory);
    } catch (error) {
      throw new Error(`Failed to restock inventory: ${(error as Error).message}`);
    }
  }

  /**
   * Gets inventory by product ID
   */
  async getInventoryByProductId(productId: string): Promise<InventoryDto | null> {
    try {
      const inventory = await this.loadInventoryByProductId(productId);
      return InventoryMapper.toDto(inventory);
    } catch (error) {
      if ((error as Error).message.includes('not found')) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Searches inventory based on criteria
   */
  async searchInventory(searchDto: InventorySearchDto): Promise<InventoryDto[]> {
    try {
      // In a real implementation, this would use the repository
      if (this.inventoryRepository) {
        const inventories = await this.inventoryRepository.search(searchDto);
        return InventoryMapper.toDtoArray(inventories);
      }

      // Mock implementation
      return [];
    } catch (error) {
      throw new Error(`Failed to search inventory: ${(error as Error).message}`);
    }
  }

  /**
   * Gets low stock items
   */
  async getLowStockItems(): Promise<InventoryDto[]> {
    try {
      if (this.inventoryRepository) {
        const lowStockInventories = await this.inventoryRepository.findLowStock();
        return InventoryMapper.toDtoArray(lowStockInventories);
      }

      // Mock implementation
      return [];
    } catch (error) {
      throw new Error(`Failed to get low stock items: ${(error as Error).message}`);
    }
  }

  /**
   * Gets inventory summary for reporting
   */
  async getInventorySummary(): Promise<InventorySummaryDto> {
    try {
      if (this.inventoryRepository) {
        const summary = await this.inventoryRepository.getSummary();
        return summary;
      }

      // Mock implementation
      return {
        totalProducts: 0,
        totalStock: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        discontinuedItems: 0,
        byCategory: [],
        byLocation: [],
      };
    } catch (error) {
      throw new Error(`Failed to get inventory summary: ${(error as Error).message}`);
    }
  }

  /**
   * Performs bulk inventory updates
   */
  async bulkUpdateInventory(bulkDto: BulkInventoryUpdateDto): Promise<InventoryDto[]> {
    try {
      const results: InventoryDto[] = [];

      for (const update of bulkDto.updates) {
        try {
          const result = await this.updateStock(update.productId, {
            newQuantity: update.newQuantity,
            reason: update.reason || bulkDto.notes || 'Bulk update',
            notes: bulkDto.notes,
          });
          results.push(result);
        } catch (error) {
          console.error(`Failed to update inventory for product ${update.productId}:`, error);
          // Continue with other updates
        }
      }

      // Publish bulk update event
      if (this.eventPublisher) {
        await this.eventPublisher.publish({
          type: 'BulkInventoryUpdated',
          data: {
            updatedCount: results.length,
            totalAttempted: bulkDto.updates.length,
            notes: bulkDto.notes,
          },
        });
      }

      return results;
    } catch (error) {
      throw new Error(`Failed to perform bulk inventory update: ${(error as Error).message}`);
    }
  }

  /**
   * Private helper to load inventory by product ID
   */
  private async loadInventoryByProductId(productId: string): Promise<Inventory> {
    if (this.inventoryRepository) {
      const inventory = await this.inventoryRepository.findByProductId(productId);
      if (!inventory) {
        throw new Error(`Inventory not found for product ${productId}`);
      }
      return inventory;
    }

    // Mock implementation for development
    throw new Error(`Inventory not found for product ${productId}`);
  }

  /**
   * Private helper to record inventory movements
   */
  private async recordInventoryMovement(
    inventory: Inventory,
    movementType: 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT' | 'TRANSFER',
    quantity: number,
    reason: string,
    referenceId?: string,
    notes?: string
  ): Promise<void> {
    // In a real implementation, this would save to a movement tracking repository
    const movementData = InventoryMapper.toMovementDto(
      inventory,
      movementType,
      quantity,
      reason,
      referenceId,
      notes
    );

    console.log('Recording inventory movement:', movementData);

    // If movement repository exists, save the movement
    // await this.movementRepository.save(movementData);
  }
}

export default InventoryApplicationService;
