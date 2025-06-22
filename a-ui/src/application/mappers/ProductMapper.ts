import { Product } from '../../domain/aggregates/product/Product';
import { ProductDto } from '../dto/ProductDto';
import { ProductId } from '../../domain/valueobjects/product/ProductValues';
import { Money } from '../../domain/valueobjects/shared/Money';
import { ProductName, ProductDescription, ProductRating } from '../../domain/valueobjects/product/ProductValues';
import { CategoryId } from '../../domain/valueobjects/product/ProductValues';
import { CreatedAt, UpdatedAt } from '../../domain/valueobjects/shared/Timestamps';

/**
 * Mapper for converting between Product domain objects and ProductDto
 */
export class ProductMapper {
  /**
   * Convert Product domain object to DTO
   */
  static toDto(product: Product): ProductDto {
    return {
      id: product.id.value.value,
      name: product.name.value,
      description: product.description.value,
      price: product.price.amount,
      currency: product.price.currency,
      rating: product.rating.value,
      reviewCount: 0, // This would need to be populated from review data
      category: {
        id: product.categoryId.value.value,
        name: '', // Would need to be populated from category data
        description: undefined,
        parentId: undefined,
        path: '',
        level: 0,
        imageUrl: undefined,
      },
      images: product.imageUrls.map((url, index) => ({
        id: `img-${index}`,
        productId: product.id.value.value,
        url: url,
        altText: product.name.value,
        displayOrder: index,
        isMain: index === 0,
      })),
      inventory: {
        productId: product.id.value.value,
        stockQuantity: 0, // Would be populated from inventory data
        restockThreshold: 0,
        status: 'IN_STOCK' as const,
        lastRestocked: undefined,
        locationCode: undefined,
      },
      specifications: [],
      tags: [],
      status: product.isActive ? 'ACTIVE' as const : 'INACTIVE' as const,
      createdAt: product.createdAt.value.toISOString(),
      updatedAt: product.updatedAt.value.toISOString(),
    };
  }

  /**
   * Convert DTO to Product domain object
   */
  static toDomain(dto: ProductDto): Product {
    const imageUrls = dto.images.map(img => img.url);

    return Product.reconstitute(
      ProductId.of(dto.id),
      ProductName.of(dto.name),
      ProductDescription.of(dto.description),
      Money.of(dto.price, dto.currency),
      ProductRating.of(dto.rating),
      CategoryId.of(dto.category.id),
      imageUrls,
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
      dto.status === 'ACTIVE'
    );
  }

  /**
   * Convert array of Product domain objects to DTOs
   */
  static toDtoArray(products: Product[]): ProductDto[] {
    return products.map(product => this.toDto(product));
  }

  /**
   * Convert array of DTOs to Product domain objects
   */
  static toDomainArray(dtos: ProductDto[]): Product[] {
    return dtos.map(dto => this.toDomain(dto));
  }
}
