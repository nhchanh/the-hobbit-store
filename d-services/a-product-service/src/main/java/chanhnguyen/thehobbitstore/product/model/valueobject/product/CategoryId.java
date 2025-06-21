package chanhnguyen.thehobbitstore.product.model.valueobject.product;

import lombok.Value;
import lombok.experimental.Accessors;
import chanhnguyen.thehobbitstore.product.model.valueobject.Id;
import jakarta.validation.constraints.NotNull;

@Value
@Accessors(fluent = true)
public class CategoryId {
    @NotNull Id value;

    public static CategoryId of(String id) {
        return new CategoryId(Id.of(id));
    }

    public static CategoryId random() {
        return new CategoryId(Id.random());
    }

    @Override
    public String toString() {
        return value.toString();
    }
}
