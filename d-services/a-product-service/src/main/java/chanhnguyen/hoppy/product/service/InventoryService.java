package chanhnguyen.hoppy.product.service;

import java.util.Optional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import chanhnguyen.hoppy.product.model.aggregate.inventory.Inventory;
import chanhnguyen.hoppy.product.model.valueobject.inventory.StockQuantity;
import chanhnguyen.hoppy.product.model.valueobject.product.ProductId;
import chanhnguyen.hoppy.product.repository.InventoryRepository;


@Service
@AllArgsConstructor
public class InventoryService {
	private final InventoryRepository inventoryRepository;

    public Inventory createInventory(Inventory inventory) {
		inventoryRepository.insertInventory(inventory);
		return inventory;
    }

    public Inventory updateStockInventory(ProductId productId, StockQuantity stockQuantity) {
		return inventoryRepository.updateStockQuantity(productId, stockQuantity);
    }

    public Optional<Inventory> getOneByProductId(ProductId productId) {
		return inventoryRepository.findByProductId(productId);
    }
}
