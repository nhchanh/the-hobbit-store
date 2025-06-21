package chanhnguyen.hoppy.product.model.aggregate.cart;

import org.junit.jupiter.api.Test;

import chanhnguyen.thehobbitstore.product.model.aggregate.cart.Cart;
import chanhnguyen.thehobbitstore.product.model.aggregate.cart.CartItem;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.CartId;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.CartItemId;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.ItemPrice;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.Quantity;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.Status;
import chanhnguyen.thehobbitstore.product.model.valueobject.customer.CustomerId;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductId;

import static org.junit.jupiter.api.Assertions.*;
import java.util.Collections;
import java.util.List;

public class CartTest {

    @Test
    public void testCartCreation() {
        CartId cartId = CartId.of("01JXSQ9FNE8Y0WT23ZKFR5PP91");
        CustomerId customerId = CustomerId.of("01JXSQ8FMGNDFAMZJDWGY5MEVN");
        List<CartItem> items = Collections.emptyList();
        Status status = Status.of("Active");
        Cart cart = Cart.builder().customerId(customerId).id(cartId).cartItems(items).status(status).build();
        assertEquals(cart.getId(), cartId);
        assertEquals(cart.getCustomerId().value(), customerId.value());
        assertEquals(cart.getCartItems().size(), items.size());
        assertEquals(cart.getStatus().value(), status.value());
    }

    @Test
    public void testAddItem() {
        CartId cartId = CartId.of("01JXSQ9FNE8Y0WT23ZKFR5PP91");
        CustomerId customerId = CustomerId.of("01JXSQ8FMGNDFAMZJDWGY5MEVN");
		ProductId productId = ProductId.of("01JXSQA4GG1FYBTFS3ENCJZ8HV");
        CartItem item = CartItem.builder()
				.id(null)
				.cartId(cartId)
				.productId(productId)
				.quantity(Quantity.of(1))
				.itemPrice(ItemPrice.of(100))
				.build();

        Cart cart = Cart.builder()
				.id(cartId)
				.customerId(customerId)
				.cartItems(Collections.emptyList())
				.status(Status.of("ACTIVE"))
				.build();
        cart.addCartItem(item);
        assertEquals(cart.getCartItems().size(), 1);
        assertEquals(cart.getCartItems().get(0), item);
    }

    @Test
    public void testRemoveItem() {
        CartId cartId = CartId.of("01JXSQ8FMGNDFAMZJDWGY5MEVN");
        CustomerId customerId = CustomerId.of("01JXSQ9STCZ3JBMJV0VMDBRZB4");
        CartItemId itemId = CartItemId.of("01JXSQ8TMBWHHNVDXAAPPFN4PV");
        CartItem item = CartItem.builder()
                .id(itemId)
                .cartId(cartId)
                .productId(ProductId.of("01JXSQ94DYP6FZJKVDD8HTWQ54"))
                .quantity(Quantity.of(1))
                .itemPrice(ItemPrice.of(100))
                .build();

        Cart cart = Cart.builder()
				.id(cartId)
				.customerId(customerId)
				.cartItems(Collections.singletonList(item))
				.status(Status.of("ACTIVE"))
				.build();
        cart.removeCartItem(item.getProductId());
        assertTrue(cart.getCartItems().isEmpty());
    }
}
