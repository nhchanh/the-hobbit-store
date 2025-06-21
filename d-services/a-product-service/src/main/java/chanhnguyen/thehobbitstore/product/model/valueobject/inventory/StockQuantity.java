package chanhnguyen.thehobbitstore.product.model.valueobject.inventory;

import lombok.Value;
import lombok.experimental.Accessors;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Value
@Accessors(fluent = true)
public class StockQuantity {
    @NotNull
    @Min(0)
	@Max(1000000)
    private final Integer value;

    public static StockQuantity of(Integer value) {
        return new StockQuantity(value);
    }
}
