package chanhnguyen.hoppy.product.repository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Getter;

@Getter
@Component
public class SQLQueries {

	@Value("${cart.selectOneById}")
	private String cartSelectOneById;

	@Value("${cart.insert}")
	private String cartInsertQuery;

	@Value("${cart.item.selectCartItemsByCartId}")
	private String cartItemSelectByCartId;

	@Value("${cart.item.insert}")
	private String cartItemInsertQuery;

	@Value("${cart.update}")
	private String cartUpdateQuery;

	@Value("${cart.item.update}")
	private String cartItemUpdateQuery;

	@Value("${product.insert}")
	private String productInsertQuery;

	@Value("${product.update}")
	private String productUpdateQuery;

	@Value("${product.selectOneById}")
	private String productSelectOneByIdQuery;


	@Value("${inventory.insert}")
	private String inventoryInsertQuery;

	@Value("${inventory.update.stock.quantity}")
	private String inventoryUpdateStockQuantityQuery;

	@Value("${inventory.selectOneByProductId}")
	private String inventorySelectOneByProductIdQuery;
}
