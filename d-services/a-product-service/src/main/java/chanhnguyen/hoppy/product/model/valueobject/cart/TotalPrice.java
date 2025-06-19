package chanhnguyen.hoppy.product.model.valueobject.cart;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import lombok.Value;
import lombok.experimental.Accessors;

@Value
@Accessors(fluent = true)
public class TotalPrice {
	@NotNull
    private final BigDecimal value;

	public static TotalPrice of(BigDecimal price) {
		return new TotalPrice(price);
	}
}
