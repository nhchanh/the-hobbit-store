package chanhnguyen.hoppy.product.model.aggregate.product;

import java.net.URL;
import java.util.List;

import jakarta.validation.constraints.NotNull;

import lombok.Builder;
import lombok.Value;
import lombok.With;
import lombok.Builder.Default;
import chanhnguyen.hoppy.product.model.valueobject.inventory.RestockThreshold;
import chanhnguyen.hoppy.product.model.valueobject.product.CategoryId;
import chanhnguyen.hoppy.product.model.valueobject.product.ProductDescription;
import chanhnguyen.hoppy.product.model.valueobject.product.ProductId;
import chanhnguyen.hoppy.product.model.valueobject.product.ProductName;
import chanhnguyen.hoppy.product.model.valueobject.product.ProductPrice;
import chanhnguyen.hoppy.product.model.valueobject.product.ProductRating;

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
