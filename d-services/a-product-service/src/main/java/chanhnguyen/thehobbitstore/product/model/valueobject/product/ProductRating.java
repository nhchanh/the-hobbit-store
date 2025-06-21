package chanhnguyen.thehobbitstore.product.model.valueobject.product;

import lombok.Value;
import lombok.experimental.Accessors;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import java.math.BigDecimal;

@Value
@Accessors(fluent = true)
public class ProductRating {
    @DecimalMin("0.0")
    @DecimalMax("5.0")
    @Digits(integer = 1, fraction = 1)
    BigDecimal value;

    public static ProductRating of(BigDecimal value) {
        return new ProductRating(value);
    }
}
