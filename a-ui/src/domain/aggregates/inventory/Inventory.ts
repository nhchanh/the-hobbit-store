/**
 * Inventory Aggregate
 * DDD Aggregate root for inventory domain
 */

import { Id } from '../../valueobjects/shared/Id';
import {
  StockQuantity,
  RestockThreshold,
  LastRestocked,
  InventoryStatus,
  LocationCode
} from '../../valueobjects/inventory/InventoryValues';
import { ValidationError } from '../../errors/DomainErrors';

// Inventory aggregate root
export class Inventory {
  private constructor(
    private readonly _productId: Id,
    private readonly _stockQuantity: StockQuantity,
    private readonly _restockThreshold: RestockThreshold,
    private readonly _lastRestocked: LastRestocked,
    private readonly _status: InventoryStatus,
    private readonly _locationCode?: LocationCode
  ) {}

  // Factory methods
  static create(
    productId: Id,
    initialStock: number,
    restockThreshold: number,
    locationCode?: string
  ): Inventory {
    return new Inventory(
      productId,
      StockQuantity.of(initialStock),
      RestockThreshold.of(restockThreshold),
      LastRestocked.now(),
      InventoryStatus.IN_STOCK,
      locationCode ? LocationCode.of(locationCode) : undefined
    );
  }

  static fromData(data: {
    productId: string;
    stockQuantity: number;
    restockThreshold: number;
    lastRestocked: Date;
    status: InventoryStatus;
    locationCode?: string;
  }): Inventory {
    return new Inventory(
      Id.of(data.productId),
      StockQuantity.of(data.stockQuantity),
      RestockThreshold.of(data.restockThreshold),
      LastRestocked.of(data.lastRestocked),
      data.status,
      data.locationCode ? LocationCode.of(data.locationCode) : undefined
    );
  }

  // Getters
  get productId(): Id {
    return this._productId;
  }

  get stockQuantity(): StockQuantity {
    return this._stockQuantity;
  }

  get restockThreshold(): RestockThreshold {
    return this._restockThreshold;
  }

  get lastRestocked(): LastRestocked {
    return this._lastRestocked;
  }

  get status(): InventoryStatus {
    return this._status;
  }

  get locationCode(): LocationCode | undefined {
    return this._locationCode;
  }

  // Domain methods
  addStock(quantity: number): Inventory {
    if (quantity <= 0) {
      throw new ValidationError('Stock quantity to add must be positive');
    }

    const newStockQuantity = this._stockQuantity.add(quantity);
    const newStatus = this.determineStatus(newStockQuantity);

    return new Inventory(
      this._productId,
      newStockQuantity,
      this._restockThreshold,
      LastRestocked.now(),
      newStatus,
      this._locationCode
    );
  }

  removeStock(quantity: number): Inventory {
    if (quantity <= 0) {
      throw new ValidationError('Stock quantity to remove must be positive');
    }

    const newStockQuantity = this._stockQuantity.subtract(quantity);
    const newStatus = this.determineStatus(newStockQuantity);

    return new Inventory(
      this._productId,
      newStockQuantity,
      this._restockThreshold,
      this._lastRestocked,
      newStatus,
      this._locationCode
    );
  }

  updateRestockThreshold(newThreshold: number): Inventory {
    const newRestockThreshold = RestockThreshold.of(newThreshold);
    const newStatus = this.determineStatus(this._stockQuantity, newRestockThreshold);

    return new Inventory(
      this._productId,
      this._stockQuantity,
      newRestockThreshold,
      this._lastRestocked,
      newStatus,
      this._locationCode
    );
  }

  restock(quantity: number): Inventory {
    return this.addStock(quantity);
  }

  markAsDiscontinued(): Inventory {
    return new Inventory(
      this._productId,
      this._stockQuantity,
      this._restockThreshold,
      this._lastRestocked,
      InventoryStatus.DISCONTINUED,
      this._locationCode
    );
  }

  updateLocation(locationCode: string): Inventory {
    return new Inventory(
      this._productId,
      this._stockQuantity,
      this._restockThreshold,
      this._lastRestocked,
      this._status,
      LocationCode.of(locationCode)
    );
  }

  // Query methods
  isInStock(): boolean {
    return this._status === InventoryStatus.IN_STOCK;
  }

  isLowStock(): boolean {
    return this._status === InventoryStatus.LOW_STOCK;
  }

  isOutOfStock(): boolean {
    return this._status === InventoryStatus.OUT_OF_STOCK;
  }

  isDiscontinued(): boolean {
    return this._status === InventoryStatus.DISCONTINUED;
  }

  hasStock(): boolean {
    return !this._stockQuantity.isEmpty();
  }

  canFulfillOrder(requestedQuantity: number): boolean {
    return this.isInStock() &&
           this._stockQuantity.value() >= requestedQuantity;
  }

  needsRestock(): boolean {
    return this._stockQuantity.isLowStock(this._restockThreshold) &&
           !this.isDiscontinued();
  }

  isStale(days: number = 90): boolean {
    return this._lastRestocked.isOlderThan(days);
  }

  // Private helper methods
  private determineStatus(
    stockQuantity: StockQuantity,
    restockThreshold: RestockThreshold = this._restockThreshold
  ): InventoryStatus {
    if (this._status === InventoryStatus.DISCONTINUED) {
      return InventoryStatus.DISCONTINUED;
    }

    if (stockQuantity.isEmpty()) {
      return InventoryStatus.OUT_OF_STOCK;
    }

    if (stockQuantity.isLowStock(restockThreshold)) {
      return InventoryStatus.LOW_STOCK;
    }

    return InventoryStatus.IN_STOCK;
  }

  // Conversion methods
  toPlainObject() {
    return {
      productId: this._productId.value,
      stockQuantity: this._stockQuantity.value(),
      restockThreshold: this._restockThreshold.value(),
      lastRestocked: this._lastRestocked.value(),
      status: this._status,
      locationCode: this._locationCode?.value()
    };
  }
}
