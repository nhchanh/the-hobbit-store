package chanhnguyen.hoppy.product.model.valueobject;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;
import lombok.experimental.Accessors;

@Value
@Accessors(fluent = true)
public class EnvironmentId {
	@Size(min = 5, max = 10)
	@NotNull
    private final String value;
}
