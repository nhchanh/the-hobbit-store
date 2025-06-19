package chanhnguyen.hoppy.product.model.valueobject.cart;

import chanhnguyen.hoppy.product.model.valueobject.Id;
import jakarta.validation.constraints.NotNull;
import lombok.Value;
import lombok.experimental.Accessors;

@Value
@Accessors(fluent = true)
public class CartId {
	@NotNull
    private final Id value;

	public static CartId of(String id) {
		return new CartId(Id.of(id));
	}
}
