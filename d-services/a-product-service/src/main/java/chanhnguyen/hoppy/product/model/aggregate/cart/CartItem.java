package chanhnguyen.hoppy.product.model.aggregate.cart;

import chanhnguyen.hoppy.product.model.valueobject.cart.CartId;
import chanhnguyen.hoppy.product.model.valueobject.cart.CartItemId;
import chanhnguyen.hoppy.product.model.valueobject.cart.ItemPrice;
import chanhnguyen.hoppy.product.model.valueobject.cart.Quantity;
import chanhnguyen.hoppy.product.model.valueobject.product.ProductId;
import lombok.Getter;
import lombok.NonNull;
import lombok.With;
import lombok.Builder;
import lombok.AllArgsConstructor;

@Getter
@Builder
@With
@AllArgsConstructor
public class CartItem {
    private final CartItemId id;
    private final CartId cartId;
	@NonNull
    private final ProductId productId;
	@NonNull
    private final Quantity quantity;
	@NonNull
    private final ItemPrice itemPrice;
}
