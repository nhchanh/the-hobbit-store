package chanhnguyen.thehobbitstore.api.dto;

import lombok.Builder;
import lombok.Value;
import java.time.Instant;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Value
@Builder
@Schema(description = "Data Transfer Object for Inventory")
public class InventoryDto {
	@Schema(description = "Product ID", example = "01JW4QBTV45WZAP8QMT64VGEQY")
	@Size(min = 26, max = 26)
   	@NotNull
    String productId;

	@Schema(description = "Stock Quantity", example = "100")
    @NotNull
	@Size(min = 0, max = 1000000)
    Integer stockQuantity;

	@Schema(description = "Restock Threshold", example = "50")
    @NotNull
	@Size(min = 0, max = 1000000)
    Integer restockThreshold;

	@Schema(description = "Last Restocked", example = "2023-01-01T00:00:00Z")
    Instant lastRestocked;
}
