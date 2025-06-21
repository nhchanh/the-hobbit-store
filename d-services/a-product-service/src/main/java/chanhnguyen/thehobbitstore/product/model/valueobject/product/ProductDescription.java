package chanhnguyen.thehobbitstore.product.model.valueobject.product;

import lombok.Value;
import lombok.experimental.Accessors;
import jakarta.validation.constraints.Size;

@Value
@Accessors(fluent = true)
public class ProductDescription {
    @Size(max = 255)
    String value;

    public static ProductDescription of(String value) {
        return new ProductDescription(value);
    }
}
