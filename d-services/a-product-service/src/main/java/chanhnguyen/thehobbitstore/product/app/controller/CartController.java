package chanhnguyen.thehobbitstore.product.app.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import chanhnguyen.thehobbitstore.api.CartApi;
import chanhnguyen.thehobbitstore.api.dto.CartDto;
import chanhnguyen.thehobbitstore.product.app.controller.mapper.CartMapper;
import chanhnguyen.thehobbitstore.product.model.aggregate.cart.Cart;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.CartId;
import chanhnguyen.thehobbitstore.product.service.CartService;
import lombok.AllArgsConstructor;


@RestController
@AllArgsConstructor
public class CartController implements CartApi {
    private final CartService cartService;

    @Override
    public ResponseEntity<CartDto> createCart(String environmentId, String tenantId, CartDto cartDto) {
        Cart createdCart = cartService.createCart(CartMapper.INSTANCE.toEntity(cartDto));
        return ResponseEntity.ok(CartMapper.INSTANCE.toDto(createdCart));
    }

    @Override
    public ResponseEntity<CartDto> updateCart(String environmentId, String tenantId, String id, CartDto cartDto) {
        CartId cartId = CartId.of(id);
        Optional<Cart> existingCart = cartService.getOneById(cartId);
        if (existingCart.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart ID not found" + " (ID: " + id + ")");
        }

        Cart cartToUpdate = CartMapper.INSTANCE.toEntity(cartDto).withId(CartId.of(id));
        Cart updatedCart = cartService.updateCart(cartToUpdate);
        return ResponseEntity.ok(CartMapper.INSTANCE.toDto(updatedCart));
    }

    @Override

    public ResponseEntity<Void> deleteCart(String environmentId, String tenantId, String id) {
        // Use environmentId and tenantId as needed
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<CartDto> getCartById(String environmentId, String tenantId, String id) {
        Optional<Cart> cart = cartService.getOneById(CartId.of(id));

        if (cart.isPresent()) {
            return ResponseEntity.ok(CartMapper.INSTANCE.toDto(cart.get()));
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart ID not found" + " (ID: " + id + ")");
    }
}
