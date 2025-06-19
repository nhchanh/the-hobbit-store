package chanhnguyen.hoppy.product.app.controller.mapper;

import java.math.BigDecimal;
import java.net.URI;
import java.net.URL;
import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import chanhnguyen.hoppy.product.model.aggregate.product.Product;
import chanhnguyen.hoppy.product.model.valueobject.inventory.RestockThreshold;
import chanhnguyen.hoppy.product.model.valueobject.product.CategoryId;
import chanhnguyen.hoppy.product.model.valueobject.product.ProductDescription;
import chanhnguyen.hoppy.product.model.valueobject.product.ProductId;
import chanhnguyen.hoppy.product.model.valueobject.product.ProductName;
import chanhnguyen.hoppy.product.model.valueobject.product.ProductPrice;
import chanhnguyen.hoppy.product.model.valueobject.product.ProductRating;
import chanhnguyen.hoppy.thehobbitstore.dto.ProductDto;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    @Mapping(target = "id", source = "id", qualifiedByName = "idToModel")
    @Mapping(target = "categoryId", source = "categoryId", qualifiedByName = "categoryIdToModel")
    @Mapping(target = "name", source = "name", qualifiedByName = "nameToModel")
    @Mapping(target = "description", source = "description", qualifiedByName = "descriptionToModel")
    @Mapping(target = "rating", source = "rating", qualifiedByName = "ratingToModel")
    @Mapping(target = "price", source = "price", qualifiedByName = "priceToModel")
    @Mapping(target = "restockThreshold", source = "restockThreshold", qualifiedByName = "restockThresholdToModel")
    @Mapping(target = "imageUrls", source = "imageUrls", qualifiedByName = "imageUrlsToModel")
    Product toEntity(ProductDto dto);

    @Named("idToModel")
    default ProductId mapIdToModel(String value) {
        return value != null ? ProductId.of(value) : null;
    }

    @Named("categoryIdToModel")
    default CategoryId mapCategoryIdToModel(String value) {
        return value != null ? CategoryId.of(value) : null;
    }

    @Named("nameToModel")
    default ProductName mapNameToModel(String value) {
        return ProductName.of(value);
    }

    @Named("descriptionToModel")
    default ProductDescription mapDescriptionToModel(String value) {
        return value != null ? ProductDescription.of(value) : null;
    }

    @Named("ratingToModel")
    default ProductRating mapRatingToModel(BigDecimal value) {
        return value != null ? ProductRating.of(value) : null;
    }

    @Named("priceToModel")
    default ProductPrice mapPriceToModel(BigDecimal value) {
        return value != null ? ProductPrice.of(value) : null;
    }

	@Named("restockThresholdToModel")
    default RestockThreshold mapRestockThresholdToModel(Integer value) {
        return RestockThreshold.of(value != null ? value : 0);
    }

    @Named("imageUrlsToModel")
    default List<URL> mapImageUrlsToModel(List<String> urls) {
        if (urls == null) return null;
        return urls.stream().map(url -> {
            try {
                return new URI(url).toURL();
            } catch (Exception e) {
                throw new RuntimeException("Invalid URL: " + url, e);
            }
        }).collect(Collectors.toList());
    }

    @Mapping(target = "id", source = "id", qualifiedByName = "idToDto")
    @Mapping(target = "categoryId", source = "categoryId", qualifiedByName = "categoryIdToDto")
    @Mapping(target = "name", source = "name", qualifiedByName = "nameToDto")
    @Mapping(target = "description", source = "description", qualifiedByName = "descriptionToDto")
    @Mapping(target = "rating", source = "rating", qualifiedByName = "ratingToDto")
    @Mapping(target = "price", source = "price", qualifiedByName = "priceToDto")
	@Mapping(target = "restockThreshold", source = "restockThreshold", qualifiedByName = "restockThresholdToDto")
    @Mapping(target = "imageUrls", source = "imageUrls", qualifiedByName = "imageUrlsToDto")
    ProductDto toDto(Product entity);

    @Named("idToDto")
    default String mapIdToDto(ProductId id) {
        return id != null ? id.value().value() : null;
    }

    @Named("categoryIdToDto")
    default String mapCategoryIdToDto(CategoryId id) {
        return id != null ? id.value().value() : null;
    }

    @Named("nameToDto")
    default String mapNameToDto(ProductName name) {
        return name != null ? name.value() : null;
    }

    @Named("descriptionToDto")
    default String mapDescriptionToDto(ProductDescription desc) {
        return desc != null ? desc.value() : null;
    }

    @Named("ratingToDto")
    default BigDecimal mapRatingToDto(ProductRating rating) {
        return rating != null ? rating.value() : null;
    }

    @Named("priceToDto")
    default BigDecimal mapPriceToDto(ProductPrice price) {
        return price != null ? price.value() : null;
    }

	@Named("restockThresholdToDto")
	default Integer mapRestockThresholdToDto(RestockThreshold restockThreshold) {
		return restockThreshold != null ? restockThreshold.value() : null;
	}

    @Named("imageUrlsToDto")
    default List<String> mapImageUrlsToDto(List<URL> urls) {
        if (urls == null) return null;
        return urls.stream().map(URL::toString).collect(Collectors.toList());
    }
}
