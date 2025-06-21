package chanhnguyen.thehobbitstore.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import chanhnguyen.thehobbitstore.api.dto.CartDto;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@Tag(name = "Cart API", description = "Operations for managing shopping carts")
@RequestMapping("/api/v1/carts")
public interface CartApi {

    @Operation(summary = "Create a new cart")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cart created successfully")
    })
    @PostMapping
    ResponseEntity<CartDto> createCart(
        @RequestHeader("X-Environment-Id") String environmentId,
        @RequestHeader("X-Tenant-Id") String tenantId,
        @Valid @RequestBody CartDto cartDto);

    @Operation(summary = "Update an existing cart")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cart updated successfully"),
        @ApiResponse(responseCode = "404", description = "Cart not found")
    })
    @PutMapping("/{id}")
    ResponseEntity<CartDto> updateCart(
        @RequestHeader("X-Environment-Id") String environmentId,
        @RequestHeader("X-Tenant-Id") String tenantId,
        @Parameter(description = "Cart ULID") @PathVariable("id") String id,
        @Valid @RequestBody CartDto cartDto);

    @Operation(summary = "Delete a cart")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Cart deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Cart not found")
    })
    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteCart(
        @RequestHeader("X-Environment-Id") String environmentId,
        @RequestHeader("X-Tenant-Id") String tenantId,
        @Parameter(description = "Cart ULID") @PathVariable("id") String id);

    @Operation(summary = "Get a cart by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cart retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Cart not found")
    })
    @GetMapping("/{id}")
    ResponseEntity<CartDto> getCartById(
        @RequestHeader("X-Environment-Id") String environmentId,
        @RequestHeader("X-Tenant-Id") String tenantId,
        @Parameter(description = "Cart ULID") @PathVariable("id") String id);
}
