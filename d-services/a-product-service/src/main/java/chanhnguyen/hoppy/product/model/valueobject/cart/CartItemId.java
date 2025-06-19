package chanhnguyen.hoppy.product.model.valueobject.cart;

import lombok.Value;
import lombok.experimental.Accessors;
import chanhnguyen.hoppy.product.model.valueobject.Id;
import jakarta.validation.constraints.NotNull;

@Value
@Accessors(fluent = true)
public class CartItemId {
	@NotNull
	private final Id value;

	public static CartItemId of(String id) {
		return new CartItemId(Id.of(id));
	}
}
