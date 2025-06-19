package chanhnguyen.hoppy.product.app.controller;

import java.util.List;
import java.util.Optional;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import chanhnguyen.hoppy.product.model.aggregate.inventory.Inventory;
import chanhnguyen.hoppy.product.model.aggregate.product.Product;
import chanhnguyen.hoppy.product.model.valueobject.inventory.StockQuantity;
import chanhnguyen.hoppy.product.model.valueobject.product.ProductId;
import chanhnguyen.hoppy.product.service.InventoryService;
import chanhnguyen.hoppy.product.service.ProductService;
import chanhnguyen.hoppy.thehobbitstore.api.productapi.ProductApi;
import chanhnguyen.hoppy.thehobbitstore.dto.InvStockQuantityDto;
import chanhnguyen.hoppy.thehobbitstore.dto.InventoryDto;
import chanhnguyen.hoppy.thehobbitstore.dto.ProductDto;
import chanhnguyen.hoppy.product.app.controller.mapper.InventoryMapper;
import chanhnguyen.hoppy.product.app.controller.mapper.ProductMapper;

@RestController
@AllArgsConstructor
public class ProductController implements ProductApi {
    private final ProductService productService;
    private final InventoryService inventoryService;

    @Override
    public ResponseEntity<ProductDto> createProduct(String environmentId, String tenantId, ProductDto productDto) {
		Product product = ProductMapper.INSTANCE.toEntity(productDto);
        Product created = productService.createProduct(product);
        return ResponseEntity.ok(ProductMapper.INSTANCE.toDto(created));
    }

    @Override
    public ResponseEntity<ProductDto> updateProduct(String environmentId, String tenantId, String id, ProductDto productDto) {
        Optional<Product> existing = productService.getOneById(ProductId.of(id));

        if (existing.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product ID not found (ID: " + id + ")");
        }

        Product toUpdate = ProductMapper.INSTANCE.toEntity(productDto).withId(ProductId.of(id));
        Product updated = productService.updateProduct(toUpdate);
        return ResponseEntity.ok(ProductMapper.INSTANCE.toDto(updated));
    }

    @Override
    public ResponseEntity<Void> deleteProduct(String environmentId, String tenantId, String id) {
        productService.deleteProduct(ProductId.of(id));
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<ProductDto> getProductById(String environmentId, String tenantId, String id) {
        Optional<Product> product = productService.getOneById(ProductId.of(id));

        if (product.isPresent()) {
            return ResponseEntity.ok(ProductMapper.INSTANCE.toDto(product.get()));
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product ID not found (ID: " + id + ")");
    }

    @Override
    public ResponseEntity<List<ProductDto>> getAllProducts(String environmentId, String tenantId) {
        // TODO: Implement pagination and filtering for products list
        return ResponseEntity.ok(List.of());
    }

    @Override
    public ResponseEntity<InventoryDto> updateInvStockQuantityByProductId(String environmentId, String tenantId,
                                    String productIdAsString, InvStockQuantityDto invStockQuantityDto) {
        // Check if product exists
		ProductId productId = ProductId.of(productIdAsString);
        Optional<Product> productOpt = productService.getOneById(productId);
        if (productOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product ID not found (ID: " + productIdAsString + ")");
        }

		StockQuantity stockQuantity = StockQuantity.of(invStockQuantityDto.getStockQuantity());
        Inventory updated = inventoryService.updateStockInventory(productId, stockQuantity);
        return ResponseEntity.ok(InventoryMapper.INSTANCE.toDto(updated));
    }

    @Override
    public ResponseEntity<Void> deleteInventoryByProductId(String environmentId, String tenantId, String productId) {
        // Check if product exists
        Optional<Product> productOpt = productService.getOneById(ProductId.of(productId));
        if (productOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product ID not found (ID: " + productId + ")");
        }
        // TODO: Remove inventory for this product
        //inventoryService.deleteInventoryByProductId(ProductId.of(id));
        return ResponseEntity.noContent().build();
    }
}
