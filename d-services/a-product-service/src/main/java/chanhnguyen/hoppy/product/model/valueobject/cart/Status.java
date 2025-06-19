package chanhnguyen.hoppy.product.model.valueobject.cart;

import jakarta.validation.constraints.NotNull;
import lombok.Value;
import lombok.experimental.Accessors;

@Value
@Accessors(fluent = true)
public class Status {
	@NotNull
    private final String value;

	public static Status of(String value) {
		if (value == null || value.trim().isEmpty()) {
			throw new IllegalArgumentException("Status value cannot be null or empty");
		}
		return new Status(value);
	}
}
