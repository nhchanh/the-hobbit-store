package chanhnguyen.thehobbitstore.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Data Transfer Object for Cart Item")
public class CartItemDto {
    @Schema(description = "Cart Item ULID", example = "01HZYX6J8QK9ZQ2V7F4G8B1C3E")
    private String id;

    @Schema(description = "Cart ULID", example = "01HZYX6J8QK9ZQ2V7F4G8B1C3D")
    private String cartId;

    @Schema(description = "Product ULID", example = "01HZYX6J8QK9ZQ2V7F4G8B1C3F")
    @NotNull
    private String productId;

    @Schema(description = "Quantity", example = "2")
    @NotNull
	@Size(min = 0)
    private Long quantity;

    @Schema(description = "Item price", example = "59.98")
    @NotNull
	@Size(min = 0)
    private BigDecimal itemPrice;
}
