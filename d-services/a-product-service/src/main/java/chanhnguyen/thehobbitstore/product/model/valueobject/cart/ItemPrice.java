package chanhnguyen.thehobbitstore.product.model.valueobject.cart;

import lombok.Value;
import lombok.experimental.Accessors;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Value
@Accessors(fluent = true)
public class ItemPrice {
	@NotNull
	@Min(0)
    private final BigDecimal value;

	public static ItemPrice of(BigDecimal price) {
		return new ItemPrice(price);
	}

	public static ItemPrice of(double price) {
		return new ItemPrice(BigDecimal.valueOf(price));
	}
}
