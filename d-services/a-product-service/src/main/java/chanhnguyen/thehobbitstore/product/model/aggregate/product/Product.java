package chanhnguyen.thehobbitstore.product.model.aggregate.product;

import java.net.URL;
import java.util.List;

import chanhnguyen.thehobbitstore.product.model.valueobject.inventory.RestockThreshold;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.CategoryId;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductDescription;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductId;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductName;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductPrice;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductRating;
import jakarta.validation.constraints.NotNull;

import lombok.Builder;
import lombok.Value;
import lombok.With;
import lombok.Builder.Default;

@Value
@With
@Builder
public class Product {
    ProductId id;

    @NotNull
    CategoryId categoryId;

    @NotNull
    ProductName name;

	ProductDescription description;

	ProductRating rating;

	@NotNull
    ProductPrice price;

	@Default
	@NotNull
	RestockThreshold restockThreshold = RestockThreshold.of(0);
    List<URL> imageUrls;
}
