package chanhnguyen.hoppy.product.model.aggregate.promotion;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Promotion {
    private String id;
    private String name;
    private String description;
    private BigDecimal discountPercent;
    private Instant validFrom;
    private Instant validTo;
}
