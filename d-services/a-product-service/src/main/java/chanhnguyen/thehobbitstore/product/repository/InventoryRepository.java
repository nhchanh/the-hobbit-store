package chanhnguyen.thehobbitstore.product.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.stereotype.Repository;

import chanhnguyen.thehobbitstore.product.app.config.Environment;
import chanhnguyen.thehobbitstore.product.app.config.Tenant;
import chanhnguyen.thehobbitstore.product.model.aggregate.inventory.Inventory;
import chanhnguyen.thehobbitstore.product.model.valueobject.inventory.LastRestocked;
import chanhnguyen.thehobbitstore.product.model.valueobject.inventory.RestockThreshold;
import chanhnguyen.thehobbitstore.product.model.valueobject.inventory.StockQuantity;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductId;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
@AllArgsConstructor
public class InventoryRepository extends RepositoryBase{
    private final JdbcTemplate jdbcTemplate;
    private final SQLQueries sqlQueries;

    public void insertInventory(Inventory inventory) {
		jdbcTemplate.update(new PreparedStatementCreator() {
			@Override
			public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
				var ps = con.prepareStatement(sqlQueries.getInventoryInsertQuery());
				ps.setString(1, StringUtils.upperCase(Environment.getEnvironmentId()));
				ps.setString(2, StringUtils.upperCase(Tenant.getTenantId().value().value()));
				ps.setString(3, inventory.getProductId().value().value());
				ps.setInt(4, inventory.getStockQuantity().value());
				ps.setInt(5, inventory.getRestockThreshold().value());
				return ps;
			}
		});
    }

	public Inventory updateStockQuantity(ProductId productId, StockQuantity stockQuantity) {
		jdbcTemplate.update(new PreparedStatementCreator() {
			@Override
			public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
				var ps = con.prepareStatement(sqlQueries.getInventoryUpdateStockQuantityQuery());
				ps.setInt(1, stockQuantity.value());
				ps.setString(2, StringUtils.upperCase(Environment.getEnvironmentId()));
				ps.setString(3, StringUtils.upperCase(Tenant.getTenantId().value().value()));
				ps.setString(4, StringUtils.upperCase(productId.value().value()));
				return ps;
			}
		});
		return findByProductId(productId).orElse(null);
	}

    public Optional<Inventory> findByProductId(ProductId productId) {
		Inventory inventory = getOneInventoryByProductId(productId);
		if (inventory == null) {
			return Optional.empty();
		}
		return Optional.of(inventory);
	}

	private Inventory getOneInventoryByProductId(ProductId productId) {
		return jdbcTemplate.queryForObject(
				sqlQueries.getInventorySelectOneByProductIdQuery(),
				(rs, rowNum) -> {
					return Inventory.builder()
							.productId(ProductId.of(rs.getString("product_id")))
							.stockQuantity(StockQuantity.of(rs.getInt("stock_quantity")))
							.restockThreshold(RestockThreshold.of(rs.getInt("restock_threshold")))
							.lastRestocked(LastRestocked.of(rs.getTimestamp("last_restocked").toInstant()))
							.build();
				},
				new Object[] { StringUtils.upperCase(Environment.getEnvironmentId()),
								StringUtils.upperCase(Tenant.getTenantId().value().value()),
								StringUtils.upperCase(productId.value().value()) });
	}

    public List<Inventory> findAll() {
        return Collections.emptyList();
    }
}
