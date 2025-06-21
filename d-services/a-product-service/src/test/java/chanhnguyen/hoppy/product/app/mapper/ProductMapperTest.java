package chanhnguyen.hoppy.product.app.mapper;

import chanhnguyen.thehobbitstore.api.dto.ProductDto;
import chanhnguyen.thehobbitstore.product.app.controller.mapper.ProductMapper;
import chanhnguyen.thehobbitstore.product.model.aggregate.product.Product;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class ProductMapperTest {
    @Test
    void testToEntityAndToDto() throws Exception {
        String id = "01JW4VXXGGZ0E4BH0PM29P0HFX";
        String categoryId = "01JW4VXXGGGKN8E2BHNG454QHH";
        String name = "The Hobbit";
        String description = "A fantasy novel";
        BigDecimal rating = new BigDecimal("4.8");
        BigDecimal price = new BigDecimal("19.99");
		int restockThreshold = 50; // Assuming restock threshold is set
        List<String> imageUrls = Arrays.asList("https://example.com/hobbit.jpg", "https://example.com/hobbit2.jpg");

        ProductDto dto = ProductDto.builder()
                .id(id)
                .categoryId(categoryId)
                .name(name)
                .description(description)
                .rating(rating)
                .price(price)
				.restockThreshold(restockThreshold)
                .imageUrls(imageUrls)
                .build();

        Product entity = ProductMapper.INSTANCE.toEntity(dto);
        assertNotNull(entity);
        assertEquals(id, entity.getId().value().value());
        assertEquals(categoryId, entity.getCategoryId().value().value());
        assertEquals(name, entity.getName().value());
        assertEquals(description, entity.getDescription().value());
        assertEquals(rating, entity.getRating().value());
        assertEquals(price, entity.getPrice().value());
		assertEquals(restockThreshold, entity.getRestockThreshold().value());
        assertEquals(new URL(imageUrls.get(0)), entity.getImageUrls().get(0));
        assertEquals(new URL(imageUrls.get(1)), entity.getImageUrls().get(1));

        ProductDto mappedDto = ProductMapper.INSTANCE.toDto(entity);
        assertNotNull(mappedDto);
        assertEquals(id, mappedDto.getId());
        assertEquals(categoryId, mappedDto.getCategoryId());
        assertEquals(name, mappedDto.getName());
        assertEquals(description, mappedDto.getDescription());
        assertEquals(rating, mappedDto.getRating());
        assertEquals(price, mappedDto.getPrice());
		assertEquals(restockThreshold, mappedDto.getRestockThreshold());
        assertEquals(imageUrls, mappedDto.getImageUrls());
    }

    @Test
    void testNullHandling() {
        assertNull(ProductMapper.INSTANCE.toEntity(null));
        assertNull(ProductMapper.INSTANCE.toDto(null));
    }
}
