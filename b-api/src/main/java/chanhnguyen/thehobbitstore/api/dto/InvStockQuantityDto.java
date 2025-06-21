package chanhnguyen.thehobbitstore.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
@Schema(description = "Data Transfer Object for Inventory Stock Quantity")
public class InvStockQuantityDto {
	@Schema(description = "Stock Quantity", example = "100")
    @NotNull
	@Size(min = 0, max = 1000000)
    private int stockQuantity;
}
