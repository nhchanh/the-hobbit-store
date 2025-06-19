package chanhnguyen.hoppy.thehobbitstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Size;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Data Transfer Object for Product")
public class ProductDto {
    @Schema(description = "Product ULID", example = "01JW4VXXGGZ0E4BH0PM29P0HFX")
    String id;

    @Schema(description = "Category ULID", example = "01JW4VXXGGGKN8E2BHNG454QHH")
    String categoryId;

    @Schema(description = "Product name", example = "The Hobbit")
    String name;

    @Schema(description = "Product description", example = "A fantasy novel")
    String description;

    @Schema(description = "Product rating (0.0 - 5.0)", example = "4.8")
	@Size(min = 0)
    BigDecimal rating;

    @Schema(description = "Product price", example = "19.99")
	@Size(min = 0)
    BigDecimal price;

	@Schema(description = "Restock Threshold", example = "50")
	@Size(min = 0, max = 1000000)
	@Nullable
    Integer restockThreshold;

	@Schema(description = "List of product image URLs")
    List<String> imageUrls;
}
