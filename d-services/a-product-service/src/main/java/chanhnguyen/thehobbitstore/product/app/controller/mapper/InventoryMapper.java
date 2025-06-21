package chanhnguyen.thehobbitstore.product.app.controller.mapper;

import java.time.Instant;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import chanhnguyen.thehobbitstore.api.dto.InventoryDto;
import chanhnguyen.thehobbitstore.product.model.aggregate.inventory.Inventory;
import chanhnguyen.thehobbitstore.product.model.valueobject.inventory.LastRestocked;
import chanhnguyen.thehobbitstore.product.model.valueobject.inventory.RestockThreshold;
import chanhnguyen.thehobbitstore.product.model.valueobject.inventory.StockQuantity;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductId;

@Mapper(componentModel = "spring")
public interface InventoryMapper {
    InventoryMapper INSTANCE = Mappers.getMapper(InventoryMapper.class);

    @Mapping(target = "productId", source = "productId", qualifiedByName = "productIdToModel")
    @Mapping(target = "stockQuantity", source = "stockQuantity", qualifiedByName = "stockQuantityToModel")
    @Mapping(target = "restockThreshold", source = "restockThreshold", qualifiedByName = "restockThresholdToModel")
    @Mapping(target = "lastRestocked", source = "lastRestocked", qualifiedByName = "lastRestockedToModel")
    Inventory toEntity(InventoryDto dto);

    @Named("productIdToModel")
    default ProductId mapProductIdToModel(String value) {
        return value != null ? ProductId.of(value) : null;
    }

    @Named("stockQuantityToModel")
    default StockQuantity mapStockQuantityToModel(Integer value) {
        return value != null ? StockQuantity.of(value) : null;
    }

    @Named("restockThresholdToModel")
    default RestockThreshold mapRestockThresholdToModel(Integer value) {
        return value != null ? RestockThreshold.of(value) : null;
    }

    @Named("lastRestockedToModel")
    default LastRestocked mapLastRestockedToModel(Instant value) {
        return value != null ? LastRestocked.of(value) : null;
    }

    @Mapping(target = "productId", source = "productId", qualifiedByName = "productIdToDto")
    @Mapping(target = "stockQuantity", source = "stockQuantity", qualifiedByName = "stockQuantityToDto")
    @Mapping(target = "restockThreshold", source = "restockThreshold", qualifiedByName = "restockThresholdToDto")
    @Mapping(target = "lastRestocked", source = "lastRestocked", qualifiedByName = "lastRestockedToDto")
    InventoryDto toDto(Inventory entity);

    @Named("productIdToDto")
    default String mapProductIdToDto(ProductId id) {
        return id != null ? id.value().value() : null;
    }

    @Named("stockQuantityToDto")
    default Integer mapStockQuantityToDto(StockQuantity value) {
        return value != null ? value.value() : null;
    }

    @Named("restockThresholdToDto")
    default Integer mapRestockThresholdToDto(RestockThreshold value) {
        return value != null ? value.value() : null;
    }

    @Named("lastRestockedToDto")
    default Instant mapLastRestockedToDto(LastRestocked value) {
        return value != null ? value.value() : null;
    }
}
