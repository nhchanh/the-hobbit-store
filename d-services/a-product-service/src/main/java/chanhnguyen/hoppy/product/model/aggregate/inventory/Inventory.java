package chanhnguyen.hoppy.product.model.aggregate.inventory;

import lombok.Builder;
import lombok.Getter;
import lombok.With;
import jakarta.validation.constraints.NotNull;

import chanhnguyen.hoppy.product.model.valueobject.inventory.LastRestocked;
import chanhnguyen.hoppy.product.model.valueobject.inventory.RestockThreshold;
import chanhnguyen.hoppy.product.model.valueobject.inventory.StockQuantity;
import chanhnguyen.hoppy.product.model.valueobject.product.ProductId;

@Getter
@With
@Builder
public class Inventory {
    @NotNull
    private final ProductId productId;
    @NotNull
    private final StockQuantity stockQuantity;
	@NotNull
    private final RestockThreshold restockThreshold;
	@NotNull
    private final LastRestocked lastRestocked;
}
