package chanhnguyen.thehobbitstore.product.model.valueobject.customer;

import lombok.Value;
import lombok.experimental.Accessors;
import chanhnguyen.thehobbitstore.product.model.valueobject.Id;
import jakarta.validation.constraints.NotNull;

@Value
@Accessors(fluent = true)
public class CustomerId {
	@NotNull
    private final Id value;

	public static CustomerId of(String id) {
		return new CustomerId(Id.of(id));
	}
}
