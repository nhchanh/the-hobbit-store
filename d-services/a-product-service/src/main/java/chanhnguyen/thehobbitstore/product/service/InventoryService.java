package chanhnguyen.thehobbitstore.product.service;

import java.util.Optional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import chanhnguyen.thehobbitstore.product.model.aggregate.inventory.Inventory;
import chanhnguyen.thehobbitstore.product.model.valueobject.inventory.StockQuantity;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductId;
import chanhnguyen.thehobbitstore.product.repository.InventoryRepository;


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
