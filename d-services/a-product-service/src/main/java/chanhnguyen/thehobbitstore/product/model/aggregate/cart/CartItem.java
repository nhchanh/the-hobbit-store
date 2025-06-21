package chanhnguyen.thehobbitstore.product.model.aggregate.cart;

import lombok.Getter;
import lombok.NonNull;
import lombok.With;
import lombok.Builder;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.CartId;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.CartItemId;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.ItemPrice;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.Quantity;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductId;
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
