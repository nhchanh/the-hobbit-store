package chanhnguyen.thehobbitstore.product.model.aggregate.inventory;

import lombok.Builder;
import lombok.Getter;
import lombok.With;
import chanhnguyen.thehobbitstore.product.model.valueobject.inventory.LastRestocked;
import chanhnguyen.thehobbitstore.product.model.valueobject.inventory.RestockThreshold;
import chanhnguyen.thehobbitstore.product.model.valueobject.inventory.StockQuantity;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductId;
import jakarta.validation.constraints.NotNull;

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
