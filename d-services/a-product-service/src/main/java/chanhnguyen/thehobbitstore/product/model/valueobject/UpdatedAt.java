package chanhnguyen.thehobbitstore.product.model.valueobject;

import lombok.Value;
import lombok.experimental.Accessors;

import java.time.Instant;

import jakarta.validation.constraints.NotNull;

@Value
@Accessors(fluent = true)
public class UpdatedAt {
	@NotNull
    private final Instant value;

	public static UpdatedAt of(Instant value) {
		return new UpdatedAt(value);
	}
}
