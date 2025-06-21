package chanhnguyen.thehobbitstore.product.service;

import chanhnguyen.thehobbitstore.api.dto.CartDto;
import chanhnguyen.thehobbitstore.product.model.aggregate.cart.Cart;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.CartId;
import chanhnguyen.thehobbitstore.product.repository.CartRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Collections;

@Slf4j
@Service
@AllArgsConstructor
public class CartService {
	private final CartRepository cartRepository;


    public Cart createCart(Cart cart) {
			return cartRepository.createCart(cart);
    }

    public Cart updateCart(Cart cart) {
		return cartRepository.updateCart(cart);
   }

    public void deleteCart(String id) {
    }

    public Optional<Cart> getOneById(CartId id) {
        return cartRepository.getOneById(id);
    }

    public List<CartDto> getAllCarts() {
        return Collections.emptyList();
    }
}
