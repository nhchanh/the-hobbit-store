package chanhnguyen.thehobbitstore.product.model.valueobject;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;
import lombok.experimental.Accessors;

@Value
@Accessors(fluent = true)
public class TenantId {
	@Size(min = 26, max = 26, message = "Tenant ID must be 26 characters")
	@NotNull
    private final Id value;

	public static TenantId of(String value) {
		return new TenantId(Id.of(value));
	}
}
