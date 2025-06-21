package chanhnguyen.thehobbitstore.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import chanhnguyen.thehobbitstore.api.dto.InvStockQuantityDto;
import chanhnguyen.thehobbitstore.api.dto.InventoryDto;
import chanhnguyen.thehobbitstore.api.dto.ProductDto;

import java.util.List;

@Tag(name = "Product API", description = "Operations for managing products")
@RequestMapping("/api/v1/products")
public interface ProductApi {

    @Operation(summary = "Create a new product")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Product created successfully")
    })
    @PostMapping
    ResponseEntity<ProductDto> createProduct(
            @RequestHeader("X-Environment-Id") String environmentId,
            @RequestHeader("X-Tenant-Id") String tenantId,
            @Valid @RequestBody ProductDto productDto);

    @Operation(summary = "Update an existing product")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Product updated successfully"),
        @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @PutMapping("/{id}")
    ResponseEntity<ProductDto> updateProduct(
            @RequestHeader("X-Environment-Id") String environmentId,
            @RequestHeader("X-Tenant-Id") String tenantId,
            @Parameter(description = "Product ULID") @PathVariable("id") String id,
        @Valid @RequestBody ProductDto productDto);

    @Operation(summary = "Delete a product")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Product deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteProduct(
            @RequestHeader("X-Environment-Id") String environmentId,
            @RequestHeader("X-Tenant-Id") String tenantId,
            @Parameter(description = "Product ULID") @PathVariable("id") String id);

    @Operation(summary = "Get a product by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Product retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/{id}")
    ResponseEntity<ProductDto> getProductById(
            @RequestHeader("X-Environment-Id") String environmentId,
            @RequestHeader("X-Tenant-Id") String tenantId,
            @Parameter(description = "Product ULID") @PathVariable("id") String id);

    @Operation(summary = "Get all products")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Products retrieved successfully")
    })
    @GetMapping
    ResponseEntity<List<ProductDto>> getAllProducts(
        @RequestHeader("X-Environment-Id") String environmentId,
        @RequestHeader("X-Tenant-Id") String tenantId);

    @Operation(summary = "Update inventory for a product")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inventory updated successfully"),
        @ApiResponse(responseCode = "404", description = "Product or inventory not found")
    })
    @PutMapping("/{id}/inventory")
    ResponseEntity<InventoryDto> updateInvStockQuantityByProductId(
        @RequestHeader("X-Environment-Id") String environmentId,
        @RequestHeader("X-Tenant-Id") String tenantId,
        @Parameter(description = "Product ULID") @PathVariable("id") String productId,
        @Valid @RequestBody InvStockQuantityDto invStockQuantityDto);

    @Operation(summary = "Remove inventory for a product")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Inventory removed successfully"),
        @ApiResponse(responseCode = "404", description = "Product or inventory not found")
    })
    @DeleteMapping("/{id}/inventory")
    ResponseEntity<Void> deleteInventoryByProductId(
        @RequestHeader("X-Environment-Id") String environmentId,
        @RequestHeader("X-Tenant-Id") String tenantId,
        @Parameter(description = "Product ULID") @PathVariable("id") String id);
}
