package chanhnguyen.hoppy.product.app.mapper;

import chanhnguyen.thehobbitstore.api.dto.InventoryDto;
import chanhnguyen.thehobbitstore.product.app.controller.mapper.InventoryMapper;
import chanhnguyen.thehobbitstore.product.model.aggregate.inventory.Inventory;
import de.huxhorn.sulky.ulid.ULID;
import org.junit.jupiter.api.Test;
import java.time.Instant;
import static org.junit.jupiter.api.Assertions.*;

class InventoryMapperTest {

    @Test
    void testToEntityAndToDto() {
        String productId = new ULID().nextULID();
        Integer stockQuantity = 42;
        Integer restockThreshold = 10;
        Instant lastRestocked = Instant.parse("2025-06-01T10:00:00Z");

        InventoryDto dto = InventoryDto.builder()
                .productId(productId)
                .stockQuantity(stockQuantity)
                .restockThreshold(restockThreshold)
                .lastRestocked(lastRestocked)
                .build();

        Inventory entity = InventoryMapper.INSTANCE.toEntity(dto);
        assertNotNull(entity);
        assertEquals(productId, entity.getProductId().value().value());
        assertEquals(stockQuantity, entity.getStockQuantity().value());
        assertEquals(restockThreshold, entity.getRestockThreshold().value());
        assertEquals(lastRestocked, entity.getLastRestocked().value());

        InventoryDto mappedDto = InventoryMapper.INSTANCE.toDto(entity);
        assertNotNull(mappedDto);
        assertEquals(productId, mappedDto.getProductId());
        assertEquals(stockQuantity, mappedDto.getStockQuantity());
        assertEquals(restockThreshold, mappedDto.getRestockThreshold());
        assertEquals(lastRestocked, mappedDto.getLastRestocked());
    }

    @Test
    void testNullHandling() {
        assertNull(InventoryMapper.INSTANCE.toEntity(null));
        assertNull(InventoryMapper.INSTANCE.toDto(null));
    }
}
