/**
 * Domain to DTO Mappers
 * Maps between domain aggregates and DTOs for API communication
 */

import { Inventory } from '../../domain/aggregates/inventory/Inventory';
import { InventoryDto, CreateInventoryDto, InventoryMovementDto } from '../dto/InventoryDto';

export class InventoryMapper {
  /**
   * Maps Inventory domain aggregate to DTO
   */
  static toDto(inventory: Inventory): InventoryDto {
    return {
      id: inventory.productId.value, // Using productId as the key for now
      productId: inventory.productId.value,
      stockQuantity: inventory.stockQuantity.value(),
      restockThreshold: inventory.restockThreshold.value(),
      lastRestocked: inventory.lastRestocked.value().toISOString(),
      status: inventory.status,
      locationCode: inventory.locationCode?.value(),
    };
  }

  /**
   * Maps CreateInventoryDto to domain data structure
   */
  static fromCreateDto(dto: CreateInventoryDto) {
    return {
      productId: dto.productId,
      initialStock: dto.initialStock,
      restockThreshold: dto.restockThreshold,
      locationCode: dto.locationCode,
    };
  }

  /**
   * Maps array of Inventory aggregates to DTOs
   */
  static toDtoArray(inventories: Inventory[]): InventoryDto[] {
    return inventories.map(inventory => this.toDto(inventory));
  }

  /**
   * Maps inventory movement data for tracking
   */
  static toMovementDto(
    inventory: Inventory,
    movementType: 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT' | 'TRANSFER',
    quantity: number,
    reason: string,
    referenceId?: string,
    notes?: string,
    userId?: string
  ): Omit<InventoryMovementDto, 'id' | 'createdAt'> {
    return {
      inventoryId: inventory.productId.value,
      productId: inventory.productId.value,
      movementType,
      quantity,
      reason,
      referenceId,
      notes,
      createdBy: userId || 'system',
    };
  }
}

export default InventoryMapper;
