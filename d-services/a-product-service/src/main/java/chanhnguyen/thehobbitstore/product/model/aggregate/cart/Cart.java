package chanhnguyen.thehobbitstore.product.model.aggregate.cart;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.With;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import chanhnguyen.thehobbitstore.product.model.valueobject.CreatedAt;
import chanhnguyen.thehobbitstore.product.model.valueobject.UpdatedAt;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.CartId;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.Quantity;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.Status;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.TotalPrice;
import chanhnguyen.thehobbitstore.product.model.valueobject.customer.CustomerId;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductId;

@Getter
@With
@Builder
public class Cart {
    private CartId id;
	@NotNull
    private CustomerId customerId;
	@NotNull
    private Status status;
    private CreatedAt createdAt;
    private UpdatedAt updatedAt;
    private List<CartItem> cartItems;

	/**
	 * Implement method to add CartItem to the cart.
	 * handles the case when cartItems is empty or has items.
	 */
	public void addCartItem(CartItem item) {
		if (cartItems == null || cartItems.isEmpty()) {
			cartItems = new ArrayList<>();
		}

		if (item == null) {
			throw new IllegalArgumentException("CartItem cannot be null");
		}

		Optional<CartItem> existingItem = cartItems.stream()
				.filter(i -> i.getProductId().equals(item.getProductId()))
				.findFirst();

		if (existingItem.isPresent()) {
			// If the item already exists, update its quantity
			CartItem existing = existingItem.get();
			Quantity newQuantity = Quantity.of(existing.getQuantity().value() + item.getQuantity().value());
			CartItem updatedItem = existing.withQuantity(newQuantity);
			List<CartItem> newCartItems = new ArrayList<>(
						cartItems.stream()
									.filter(i -> !i.getProductId().equals(updatedItem.getProductId()))
									.toList());
			newCartItems.add(updatedItem);
			cartItems = Collections.unmodifiableList(newCartItems);
		} else {
			List<CartItem> newCartItems = new ArrayList<>(
					cartItems.stream()
							.filter(i -> !i.getProductId().equals(item.getProductId()))
							.toList());
			newCartItems.add(item);
			cartItems = Collections.unmodifiableList(newCartItems);
		}

	}

	public void removeCartItem(ProductId productId) {
		List<CartItem> newCartItems = new ArrayList<>(
				cartItems.stream()
						.filter(i -> !i.getProductId().equals(productId))
						.toList());
		cartItems = Collections.unmodifiableList(newCartItems);
	}

	/**
	 * Implement method to return number of items in the cart.
	 * @return the number of items in the cart
	 */
	public int getNumberOfItems() {
		return cartItems.size();
	}

	/**
	 * Implement method to return total price of items in the cart.
	 * @return the total price of items in the cart
	 */
	public TotalPrice getTotalPrice() {
		BigDecimal total = cartItems.stream()
					.map(i -> i.getItemPrice().value().multiply(BigDecimal.valueOf(i.getQuantity().value())))
					.reduce(BigDecimal.ZERO, BigDecimal::add);
		return TotalPrice.of(total);
	}
}
