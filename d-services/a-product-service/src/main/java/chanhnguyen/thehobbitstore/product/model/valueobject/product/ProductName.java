package chanhnguyen.thehobbitstore.product.model.valueobject.product;

import lombok.Value;
import lombok.experimental.Accessors;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Value
@Accessors(fluent = true)
public class ProductName {
    @NotNull
    @Size(max = 100, min = 1)
    String value;

    public static ProductName of(String value) {
		if (value == null || value.isEmpty() || value.length() > 100) {
			throw new IllegalArgumentException("Product name must be between 1 and 100 characters long.");
		}
        return new ProductName(value);
    }
}
