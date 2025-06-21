package chanhnguyen.thehobbitstore.product.model.valueobject.inventory;

import lombok.Value;
import lombok.experimental.Accessors;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Value
@Accessors(fluent = true)
public class RestockThreshold {
    @NotNull
    @Min(0)
    @Max(1000000)
    private final Integer value;

    public static RestockThreshold of(Integer value) {
		if (value == null) {
			throw new IllegalArgumentException("Restock threshold value cannot be null");
		}

        return new RestockThreshold(value);
    }
}
