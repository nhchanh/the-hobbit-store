package chanhnguyen.hoppy.product.model.valueobject.inventory;

import lombok.Value;
import lombok.experimental.Accessors;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

@Value
@Accessors(fluent = true)
public class LastRestocked {
    @NotNull
    private final Instant value;

    public static LastRestocked of(Instant value) {
        return new LastRestocked(value);
    }
}
