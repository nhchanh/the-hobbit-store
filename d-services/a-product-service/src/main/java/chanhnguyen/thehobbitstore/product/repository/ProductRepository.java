package chanhnguyen.thehobbitstore.product.repository;

import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;


import chanhnguyen.thehobbitstore.product.app.config.Environment;
import chanhnguyen.thehobbitstore.product.app.config.Tenant;
import chanhnguyen.thehobbitstore.product.model.aggregate.product.Product;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.CategoryId;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductDescription;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductId;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductName;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductPrice;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductRating;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.*;


@Repository
@AllArgsConstructor
public class ProductRepository extends RepositoryBase {
    private final SQLQueries sqlQueries;
	private final JdbcTemplate jdbcTemplate;
	private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public Product insert(Product product) {
		ProductId productId = ProductId.of(generateULID());
		namedParameterJdbcTemplate.update(sqlQueries.getProductInsertQuery(), Map.of(
			"environment_id", Environment.getEnvironmentId(),
			"tenant_id", Tenant.getTenantId().value().value(),
			"product_id", productId.value().value(),
			"name", product.getName().value(),
			"description", product.getDescription().value(),
			"rating", product.getRating().value(),
			"price", product.getPrice().value(),
			"category_id", product.getCategoryId().value().value(),
			"restock_threshold", product.getRestockThreshold().value().intValue()
		));

		return getOneProductId(productId);
    }

	public Product update(Product product) {
		jdbcTemplate.update(new PreparedStatementCreator() {
			@Override
			public PreparedStatement createPreparedStatement(java.sql.Connection con) throws SQLException {
				PreparedStatement ps = con.prepareStatement(sqlQueries.getProductUpdateQuery());
				ps.setString(1, product.getName().value());
				ps.setString(2, product.getDescription().value());
				ps.setBigDecimal(3, product.getRating().value());
				ps.setBigDecimal(4, product.getPrice().value());
				ps.setString(5, product.getCategoryId().value().value());
				ps.setString(6, Environment.getEnvironmentId());
				ps.setString(7, Tenant.getTenantId().value().value());
				ps.setString(8, product.getId().value().value());
				return ps;
			}
		});

		return null;
	}

	public Optional<Product> getOneById(ProductId id) {
		Product product = getOneProductId(id);
		if (product == null) {
			return Optional.empty();
		}

		return Optional.of(product);
	}

	private Product getOneProductId(ProductId id) {
		return jdbcTemplate.queryForObject(
				sqlQueries.getProductSelectOneByIdQuery(),
				(rs, rowNum) -> {
					return Product.builder()
							.id(ProductId.of(rs.getString("id")))
							.name(ProductName.of(rs.getString("name")))
							.description(ProductDescription.of(rs.getString("description")))
							.rating(ProductRating.of(rs.getBigDecimal("rating")))
							.price(ProductPrice.of(rs.getBigDecimal("price")))
							.categoryId(CategoryId.of(rs.getString("category_id")))
							.build();
				},
				new Object[] { Environment.getEnvironmentId(),
								Tenant.getTenantId().value().value(),
								id.value().value() });
    }

    public void deleteById(ProductId id) {
    }
}
