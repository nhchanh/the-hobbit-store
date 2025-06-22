import { Cart } from '../../domain/aggregates/cart/Cart';
import { CartItem } from '../../domain/aggregates/cart/CartItem';
import { CartDto, CartItemDto } from '../dto/CartDto';
import { Id } from '../../domain/valueobjects/shared/Id';
import { Money } from '../../domain/valueobjects/shared/Money';
import { CartId } from '../../domain/valueobjects/cart/CartValues';
import { CustomerId } from '../../domain/valueobjects/customer/CustomerValues';
import { ProductId } from '../../domain/valueobjects/product/ProductValues';
import { Quantity } from '../../domain/valueobjects/cart/CartValues';
import { CartStatus } from '../../domain/valueobjects/cart/CartValues';
import { CreatedAt, UpdatedAt } from '../../domain/valueobjects/shared/Timestamps';

/**
 * Mapper for converting between Cart domain objects and CartDto
 */
export class CartMapper {
  /**
   * Convert Cart domain object to DTO
   */
  static toDto(cart: Cart): CartDto {
    const totalPrice = cart.calculateTotal();

    return {
      id: cart.id.value.value,
      customerId: cart.customerId.value.value,
      items: cart.items.map((item: CartItem) => ({
        id: item.id,
        cartId: cart.id.value.value,
        productId: item.productId.value.value,
        productName: '', // This would need to be populated from product data
        productPrice: item.unitPrice.amount,
        quantity: item.quantity.value,
        itemPrice: item.calculateSubtotal().amount,
        imageUrl: undefined,
      })),
      totalItems: cart.itemCount,
      totalPrice: totalPrice.amount,
      currency: totalPrice.currency,
      status: cart.status.value as 'ACTIVE' | 'ABANDONED' | 'CHECKED_OUT',
      createdAt: cart.createdAt.value.toISOString(),
      updatedAt: cart.updatedAt.value.toISOString(),
    };
  }

  /**
   * Convert DTO to Cart domain object
   */
  static toDomain(dto: CartDto): Cart {
    const cartItems = dto.items.map((itemDto: CartItemDto) =>
      CartItem.reconstitute(
        itemDto.id,
        ProductId.of(itemDto.productId),
        Quantity.of(itemDto.quantity),
        Money.of(itemDto.productPrice, dto.currency)
      )
    );

    return Cart.reconstitute(
      CartId.of(dto.id),
      CustomerId.of(dto.customerId),
      CartStatus.of(dto.status),
      cartItems,
      CreatedAt.of(new Date(dto.createdAt)),
      UpdatedAt.of(new Date(dto.updatedAt))
    );
  }

  /**
   * Convert array of Cart domain objects to DTOs
   */
  static toDtoArray(carts: Cart[]): CartDto[] {
    return carts.map(cart => this.toDto(cart));
  }

  /**
   * Convert array of DTOs to Cart domain objects
   */
  static toDomainArray(dtos: CartDto[]): Cart[] {
    return dtos.map(dto => this.toDomain(dto));
  }
}
