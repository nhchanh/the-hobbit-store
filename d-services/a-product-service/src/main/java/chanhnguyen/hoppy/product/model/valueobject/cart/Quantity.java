package chanhnguyen.hoppy.product.model.valueobject.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Value;
import lombok.experimental.Accessors;

@Value
@Accessors(fluent = true)
public class Quantity {
	@NotNull
	@Min(0)
    private final long value;

	public static Quantity of(long value) {
		return new Quantity(value);
	}
}
