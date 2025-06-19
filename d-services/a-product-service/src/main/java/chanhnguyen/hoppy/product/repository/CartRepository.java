package chanhnguyen.hoppy.product.repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import chanhnguyen.hoppy.product.app.config.Environment;
import chanhnguyen.hoppy.product.app.config.Tenant;
import chanhnguyen.hoppy.product.model.aggregate.cart.Cart;
import chanhnguyen.hoppy.product.model.aggregate.cart.CartItem;
import chanhnguyen.hoppy.product.model.valueobject.CreatedAt;
import chanhnguyen.hoppy.product.model.valueobject.UpdatedAt;
import chanhnguyen.hoppy.product.model.valueobject.cart.CartId;
import chanhnguyen.hoppy.product.model.valueobject.cart.CartItemId;
import chanhnguyen.hoppy.product.model.valueobject.cart.ItemPrice;
import chanhnguyen.hoppy.product.model.valueobject.cart.Quantity;
import chanhnguyen.hoppy.product.model.valueobject.cart.Status;
import chanhnguyen.hoppy.product.model.valueobject.customer.CustomerId;
import chanhnguyen.hoppy.product.model.valueobject.product.ProductId;

@Slf4j
@Repository
@AllArgsConstructor
public class CartRepository extends RepositoryBase {
	private final JdbcTemplate jdbcTemplate;
	private final SQLQueries sqlQueries;

	@Transactional(readOnly = true)
	public Optional<Cart> getOneById(CartId id) {
		Cart cart = getOneCart(id);
		if (cart == null) {
			return Optional.empty();
		}
		List<CartItem> cartItems = 	getCartItems(id);
		return Optional.of(cart.withCartItems(cartItems));
	}

	private Cart getOneCart(CartId id) {
		return jdbcTemplate.queryForObject(
				sqlQueries.getCartSelectOneById(),
				(rs, rowNum) -> {
					return Cart.builder()
							.id(new CartId(id.value()))
							.customerId(CustomerId.of(rs.getString("customer_id")))
							.status(Status.of(rs.getString("status")))
							.createdAt(CreatedAt.of(rs.getTimestamp("created_at").toInstant()))
							.updatedAt(UpdatedAt.of(rs.getTimestamp("updated_at").toInstant()))
							.build();
				},
				new Object[] { StringUtils.upperCase(Environment.getEnvironmentId()),
								StringUtils.upperCase(Tenant.getTenantId().value().value()),
								StringUtils.upperCase(id.value().value()) });
	}

	private List<CartItem> getCartItems(CartId id) {
		return jdbcTemplate.query(
				sqlQueries.getCartItemSelectByCartId(),
				(rs, rowNum) -> {
					return CartItem.builder()
							.id(CartItemId.of(StringUtils.upperCase(rs.getString("id"))))
							.cartId(CartId.of(StringUtils.upperCase(rs.getString("cart_id"))))
							.productId(ProductId.of(StringUtils.upperCase(rs.getString("product_id"))))
							.quantity(Quantity.of(rs.getLong("quantity")))
							.itemPrice(ItemPrice.of(rs.getBigDecimal("item_price")))
							.build();
				},
				new Object[] { StringUtils.upperCase(Environment.getEnvironmentId()),
								StringUtils.upperCase(Tenant.getTenantId().value().value()),
								StringUtils.upperCase(id.value().value()) });
	}

	@Transactional
	public Cart createCart(Cart cart) {
		CartId cartId = CartId.of(generateULID());

		insertCart(cartId, cart);
		insertCartItem(cartId, cart.getCartItems());

		return getOneById(cartId).orElseThrow(() -> new RuntimeException("Failed to create cart with ID: " + cartId.value().value()));
	}

	private void insertCart(CartId cartId, Cart cart) {
		jdbcTemplate.update(new PreparedStatementCreator() {
			@SuppressWarnings("null")
			@Override
			public PreparedStatement createPreparedStatement(java.sql.Connection con) throws SQLException {
				PreparedStatement ps = con.prepareStatement(sqlQueries.getCartInsertQuery());
				ps.setString(1, StringUtils.upperCase(Environment.getEnvironmentId()));
				ps.setString(2, StringUtils.upperCase(Tenant.getTenantId().value().value()));
				ps.setString(3, StringUtils.upperCase(cartId.value().value()));
				ps.setString(4, StringUtils.upperCase(cart.getCustomerId().value().value()));
				ps.setString(5, cart.getStatus().value());
				return ps;
			}
		});
	}

	private void insertCartItem(CartId cartId, List<CartItem> cartItems) {
		jdbcTemplate.batchUpdate(sqlQueries.getCartItemInsertQuery(),
									new BatchPreparedStatementSetter() {
										@SuppressWarnings("null")
										@Override
										public void setValues(PreparedStatement ps, int i) throws SQLException {
											CartItem item = cartItems.get(i);
											ps.setString(1, StringUtils.upperCase(Environment.getEnvironmentId()));
											ps.setString(2, StringUtils.upperCase(Tenant.getTenantId().value().value()));
											ps.setString(3, StringUtils.upperCase(generateULID().toString()));
											ps.setString(4, StringUtils.upperCase(cartId.value().value()));
											ps.setString(5, StringUtils.upperCase(item.getProductId().value().value()));
											ps.setLong(6, item.getQuantity().value());
											ps.setBigDecimal(7, item.getItemPrice().value());
										}

										@Override
										public int getBatchSize() {
											return cartItems.size();
										}
									});
	}

	public Cart updateCart(Cart cart) {
		jdbcTemplate.update(sqlQueries.getCartUpdateQuery(),
				cart.getStatus().value(),
				StringUtils.upperCase(Environment.getEnvironmentId()),
				StringUtils.upperCase(Tenant.getTenantId().value().value()),
				StringUtils.upperCase(cart.getId().value().value()));

		return getOneById(cart.getId()).get();
	}

	public void deleteCart(String id) {
		// Do nothing
	}
}
