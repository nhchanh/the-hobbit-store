package chanhnguyen.hoppy.product.model.valueobject.product;

import lombok.Value;
import lombok.experimental.Accessors;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import java.math.BigDecimal;

@Value
@Accessors(fluent = true)
public class ProductPrice {
    @DecimalMin("0.0")
    @Digits(integer = 12, fraction = 2)
    BigDecimal value;

    public static ProductPrice of(BigDecimal value) {
        return new ProductPrice(value);
    }
}
