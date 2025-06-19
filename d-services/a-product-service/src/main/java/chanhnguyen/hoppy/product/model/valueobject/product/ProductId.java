package chanhnguyen.hoppy.product.model.valueobject.product;

import lombok.Value;
import lombok.experimental.Accessors;
import chanhnguyen.hoppy.product.model.valueobject.Id;
import jakarta.validation.constraints.NotNull;

@Value
@Accessors(fluent = true)
public class ProductId {
	@NotNull
	private final Id value;

	public static ProductId of(String id) {
		return new ProductId(Id.of(id));
	}
}
