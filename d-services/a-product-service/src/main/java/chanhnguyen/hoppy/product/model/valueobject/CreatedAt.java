package chanhnguyen.hoppy.product.model.valueobject;

import java.time.Instant;

import jakarta.validation.constraints.NotNull;
import lombok.Value;
import lombok.experimental.Accessors;

@Value
@Accessors(fluent = true)
public class CreatedAt {
	@NotNull
    private final Instant value;

	public static CreatedAt of(Instant value) {
		return new CreatedAt(value);
	}
}
