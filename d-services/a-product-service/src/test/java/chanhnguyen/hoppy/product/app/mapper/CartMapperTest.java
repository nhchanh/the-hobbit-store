package chanhnguyen.hoppy.product.app.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;

import chanhnguyen.thehobbitstore.api.dto.CartDto;
import chanhnguyen.thehobbitstore.api.dto.CartItemDto;
import chanhnguyen.thehobbitstore.product.app.controller.mapper.CartMapper;
import chanhnguyen.thehobbitstore.product.model.aggregate.cart.Cart;
import chanhnguyen.thehobbitstore.product.model.aggregate.cart.CartItem;
import chanhnguyen.thehobbitstore.product.model.valueobject.CreatedAt;
import chanhnguyen.thehobbitstore.product.model.valueobject.UpdatedAt;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.CartId;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.CartItemId;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.ItemPrice;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.Quantity;
import chanhnguyen.thehobbitstore.product.model.valueobject.cart.Status;
import chanhnguyen.thehobbitstore.product.model.valueobject.customer.CustomerId;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductId;

public class CartMapperTest {
    private final CartMapper mapperUnderTest = CartMapper.INSTANCE;

    @Test
    public void testToEntity() {
        CartDto givenCardDto = CartDto.builder()
                .id("01JW40JPHWAXVTJR7WSWHMDTYC")
                .customerId("01JW40JCAQX9WQ8Q3K6PET6X2B")
                .status("ACTIVE")
                .createdAt("2025-05-18T12:00:00Z")
                .updatedAt("2025-05-18T12:30:00Z")
                .cartItems(buildCartItemDtoList())
                .build();

        Cart actualCartEntity = mapperUnderTest.toEntity(givenCardDto);

		assertEquals(actualCartEntity.getId().value().value(), givenCardDto.getId());
        assertEquals(actualCartEntity.getCustomerId().value().value(), givenCardDto.getCustomerId());
        assertEquals(actualCartEntity.getStatus().value(), givenCardDto.getStatus());
		assertEquals(actualCartEntity.getCreatedAt().value().toString(), givenCardDto.getCreatedAt());
		assertEquals(actualCartEntity.getUpdatedAt().value().toString(), givenCardDto.getUpdatedAt());
		assertEquals(actualCartEntity.getCartItems().size(), givenCardDto.getCartItems().size());
		for (int i = 0; i < actualCartEntity.getCartItems().size(); i++) {
			CartItem actualItem = actualCartEntity.getCartItems().get(i);
			CartItemDto givenCartItemDto = givenCardDto.getCartItems().get(i);
			assertEquals(actualItem.getId().value().value(), givenCartItemDto.getId());
			assertEquals(actualItem.getCartId().value().value(), givenCartItemDto.getCartId());
			assertEquals(actualItem.getProductId().value().value(), givenCartItemDto.getProductId());
			assertEquals(actualItem.getQuantity().value(), givenCartItemDto.getQuantity());
			assertEquals(actualItem.getItemPrice().value(), givenCartItemDto.getItemPrice());
		}
	}

    @Test
    public void testToDto() {
        Cart givenCartEntity = Cart.builder()
                .id(CartId.of("01JW41YG54QDQ45RTEKR4S5NKT"))
                .customerId(CustomerId.of("01JW41Y8MNFH9TRXEW83HNCYZZ"))
                .status(Status.of("ACTIVE"))
                .createdAt(CreatedAt.of(Instant.now()))
                .updatedAt(UpdatedAt.of(Instant.now()))
                .cartItems(buildCartItemList())
                .build();

        CartDto actualCartDto = mapperUnderTest.toDto(givenCartEntity);

		assertEquals(actualCartDto.getId(), givenCartEntity.getId().value().value());
        assertEquals(actualCartDto.getCustomerId(), givenCartEntity.getCustomerId().value().value());
        assertEquals(actualCartDto.getStatus(), givenCartEntity.getStatus().value());
		assertEquals(actualCartDto.getCreatedAt(), givenCartEntity.getCreatedAt().value().toString());
		assertEquals(actualCartDto.getUpdatedAt(), givenCartEntity.getUpdatedAt().value().toString());
		assertEquals(actualCartDto.getCartItems().size(), givenCartEntity.getCartItems().size());
		for (int i = 0; i < actualCartDto.getCartItems().size(); i++) {
			CartItemDto actualItem = actualCartDto.getCartItems().get(i);
			CartItem givenCartItem = givenCartEntity.getCartItems().get(i);
			assertEquals(actualItem.getId(), givenCartItem.getId().value().value());
			assertEquals(actualItem.getCartId(), givenCartItem.getCartId().value().value());
			assertEquals(actualItem.getProductId(), givenCartItem.getProductId().value().value());
			assertEquals(actualItem.getQuantity(), givenCartItem.getQuantity().value());
			assertEquals(actualItem.getItemPrice(), givenCartItem.getItemPrice().value());
		}
    }

	private static List<CartItemDto> buildCartItemDtoList() {
		return Arrays.asList(
			CartItemDto.builder()
				.id("01JW41Y8MNFH9TRXEW83HNCY01")
				.cartId("01JW41YG54QDQ45RTEKR4S5NKT")
				.productId("01JW41Y8MNFH9TRXEW83HNCY02")
				.quantity(2L)
				.itemPrice(new BigDecimal("19.99"))
				.build(),
			CartItemDto.builder()
				.id("01JW41Y8MNFH9TRXEW83HNCY03")
				.cartId("01JW41YG54QDQ45RTEKR4S5NKT")
				.productId("01JW41Y8MNFH9TRXEW83HNCY04")
				.quantity(1L)
				.itemPrice(new BigDecimal("9.99"))
				.build()
		);
	}

	private static List<CartItem> buildCartItemList() {
		return Arrays.asList(
			CartItem.builder()
				.id(CartItemId.of("01JW41Y8MNFH9TRXEW83HNCY01"))
				.cartId(CartId.of("01JW41YG54QDQ45RTEKR4S5NKT"))
				.productId(ProductId.of("01JW41Y8MNFH9TRXEW83HNCY02"))
				.quantity(Quantity.of(2L))
				.itemPrice(ItemPrice.of(new BigDecimal("19.99")))
				.build(),
			CartItem.builder()
				.id(CartItemId.of("01JW41Y8MNFH9TRXEW83HNCY03"))
				.cartId(CartId.of("01JW41YG54QDQ45RTEKR4S5NKT"))
				.productId(ProductId.of("01JW41Y8MNFH9TRXEW83HNCY04"))
				.quantity(Quantity.of(1L))
				.itemPrice(ItemPrice.of(new BigDecimal("9.99")))
				.build()
		);
	}
}
