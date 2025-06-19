package chanhnguyen.hoppy.thehobbitstore.api.orderapi;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import chanhnguyen.hoppy.thehobbitstore.dto.OrderDto;

@Tag(name = "Order API", description = "Operations for managing orders")
@RequestMapping("/api/v1/orders")
public interface OrderApi {

    @Operation(summary = "Create a new order")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Order created successfully")
    })
    @PostMapping
    ResponseEntity<OrderDto> createOrder(@Valid @RequestBody OrderDto orderDto);

    @Operation(summary = "Update an existing order")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Order updated successfully"),
        @ApiResponse(responseCode = "404", description = "Order not found")
    })
    @PutMapping("/{id}")
    ResponseEntity<OrderDto> updateOrder(
        @Parameter(description = "Order ULID") @PathVariable("id") String id,
        @Valid @RequestBody OrderDto orderDto);

    @Operation(summary = "Delete an order")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Order deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Order not found")
    })
    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteOrder(@Parameter(description = "Order ULID") @PathVariable("id") String id);

    @Operation(summary = "Get an order by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Order retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Order not found")
    })
    @GetMapping("/{id}")
    ResponseEntity<OrderDto> getOrderById(@Parameter(description = "Order ULID") @PathVariable("id") String id);
}
