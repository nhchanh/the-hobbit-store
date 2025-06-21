package chanhnguyen.thehobbitstore.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Data Transfer Object for Cart")
public class CartDto {
    @Schema(description = "Cart ULID", example = "01JW4QBTV45WZAP8QMT64VGEQY")
    private String id;

    @Schema(description = "Customer ULID", example = "01JW4QC74DFWFTNB1VZQH148ZM")
    @NotNull
    private String customerId;

    @Schema(description = "Cart status", example = "ACTIVE")
    @NotNull
    private String status;

    @Schema(description = "Cart creation timestamp", example = "2025-05-18T12:00:00Z")
    private String createdAt;

    @Schema(description = "Cart update timestamp", example = "2025-05-18T12:30:00Z")
    private String updatedAt;

    @Schema(description = "Cart items")
    private List<CartItemDto> cartItems;
}
