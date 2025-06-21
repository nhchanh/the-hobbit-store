package chanhnguyen.thehobbitstore.api.dto;

import lombok.Builder;
import lombok.Value;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Value
@Builder
public class OrderDto {
    String id;
    String customerId;
    List<String> productIds;
    List<Integer> quantities;
    BigDecimal totalAmount;
    String status;
    Instant createdAt;
    Instant updatedAt;
}
