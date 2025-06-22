/**
 * Integration Tests - Cart Application Service
 * Tests the integration between application layer and domain
 */

import { CartApplicationService } from '../../application/services/CartApplicationService';
import { CartMapper } from '../../application/mappers/CartMapper';
import { Cart } from '../../domain/aggregates/cart/Cart';
import { CartItem } from '../../domain/aggregates/cart/CartItem';
import { Money } from '../../domain/valueobjects/shared/Money';
import { CartId } from '../../domain/valueobjects/cart/CartValues';
import { CustomerId } from '../../domain/valueobjects/customer/CustomerValues';
import { ProductId } from '../../domain/valueobjects/product/ProductValues';
import { Quantity } from '../../domain/valueobjects/cart/CartValues';

// Mock the API client
jest.mock('../../infrastructure/api/CartApiClient');

describe('Cart Application Service Integration', () => {
  let cartService: CartApplicationService;
  let mockApiClient: jest.Mocked<any>;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create service instance with mocked dependencies
    cartService = new CartApplicationService();

    // Mock API responses
    mockApiClient = {
      getByCustomerId: jest.fn(),
      addItem: jest.fn(),
      updateItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
  });

  describe('Add Item to Cart', () => {
    it('should add new item to empty cart', async () => {
      // Arrange
      const customerId = CustomerId.of('customer-123');
      const productId = ProductId.of('product-456');
      const quantity = Quantity.of(2);
      const unitPrice = Money.of(29.99, 'USD');

      const emptyCart = Cart.create(customerId);
      const cartWithItem = Cart.create(customerId);
      const newItem = CartItem.create(productId, quantity, unitPrice);
      cartWithItem.addItem(newItem);

      // Mock API responses
      mockApiClient.getByCustomerId.mockResolvedValue(
        CartMapper.toDto(emptyCart)
      );
      mockApiClient.addItem.mockResolvedValue(
        CartMapper.toDto(cartWithItem)
      );

      // Act
      const result = await cartService.addItemToCart({
        customerId: customerId.value,
        productId: productId.value,
        quantity: quantity.value,
        unitPrice: unitPrice.amount,
      });

      // Assert
      expect(result).toBeDefined();
      expect(result.items).toHaveLength(1);
      expect(result.items[0].productId.value).toBe(productId.value);
      expect(result.items[0].quantity.value).toBe(quantity.value);
      expect(mockApiClient.getByCustomerId).toHaveBeenCalledWith(customerId.value);
      expect(mockApiClient.addItem).toHaveBeenCalled();
    });

    it('should update quantity when adding existing item', async () => {
      // Arrange
      const customerId = CustomerId.of('customer-123');
      const productId = ProductId.of('product-456');
      const existingQuantity = Quantity.of(1);
      const additionalQuantity = Quantity.of(2);
      const unitPrice = Money.of(29.99, 'USD');

      const cartWithItem = Cart.create(customerId);
      const existingItem = CartItem.create(productId, existingQuantity, unitPrice);
      cartWithItem.addItem(existingItem);

      const updatedCart = Cart.create(customerId);
      const updatedItem = CartItem.create(productId, Quantity.of(3), unitPrice);
      updatedCart.addItem(updatedItem);

      // Mock API responses
      mockApiClient.getByCustomerId.mockResolvedValue(
        CartMapper.toDto(cartWithItem)
      );
      mockApiClient.addItem.mockResolvedValue(
        CartMapper.toDto(updatedCart)
      );

      // Act
      const result = await cartService.addItemToCart({
        customerId: customerId.value,
        productId: productId.value,
        quantity: additionalQuantity.value,
        unitPrice: unitPrice.amount,
      });

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.items[0].quantity.value).toBe(3);
    });
  });

  describe('Remove Item from Cart', () => {
    it('should remove item from cart successfully', async () => {
      // Arrange
      const customerId = CustomerId.of('customer-123');
      const productId = ProductId.of('product-456');
      const cartId = CartId.generate();

      const cartWithItem = Cart.create(customerId);
      const item = CartItem.create(
        productId,
        Quantity.of(1),
        Money.of(29.99, 'USD')
      );
      cartWithItem.addItem(item);

      const emptyCart = Cart.create(customerId);

      // Mock API responses
      mockApiClient.removeItem.mockResolvedValue(
        CartMapper.toDto(emptyCart)
      );

      // Act
      const result = await cartService.removeItemFromCart({
        cartId: cartId.value,
        itemId: item.id,
      });

      // Assert
      expect(result.items).toHaveLength(0);
      expect(mockApiClient.removeItem).toHaveBeenCalledWith(
        cartId.value,
        item.id
      );
    });
  });

  describe('Calculate Cart Total', () => {
    it('should calculate total correctly for multiple items', async () => {
      // Arrange
      const customerId = CustomerId.of('customer-123');
      const cart = Cart.create(customerId);

      const item1 = CartItem.create(
        ProductId.of('product-1'),
        Quantity.of(2),
        Money.of(10.00, 'USD')
      );
      const item2 = CartItem.create(
        ProductId.of('product-2'),
        Quantity.of(1),
        Money.of(15.50, 'USD')
      );

      cart.addItem(item1);
      cart.addItem(item2);

      // Act
      const total = cart.calculateTotal();

      // Assert
      expect(total.amount).toBe(35.50); // (2 * 10.00) + (1 * 15.50)
      expect(total.currency).toBe('USD');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      // Arrange
      const customerId = CustomerId.of('customer-123');

      // Mock API error
      mockApiClient.getByCustomerId.mockRejectedValue(
        new Error('Network error')
      );

      // Act & Assert
      await expect(
        cartService.getCartByCustomerId(customerId.value)
      ).rejects.toThrow('Network error');
    });

    it('should validate domain rules before API calls', async () => {
      // Arrange
      const customerId = CustomerId.of('customer-123');

      // Act & Assert
      await expect(
        cartService.addItemToCart({
          customerId: customerId.value,
          productId: '', // Invalid product ID
          quantity: 1,
          unitPrice: 10.00,
        })
      ).rejects.toThrow();
    });
  });

  describe('Data Mapping', () => {
    it('should correctly map between DTOs and domain objects', async () => {
      // Arrange
      const customerId = CustomerId.of('customer-123');
      const cart = Cart.create(customerId);
      const item = CartItem.create(
        ProductId.of('product-456'),
        Quantity.of(1),
        Money.of(29.99, 'USD')
      );
      cart.addItem(item);

      // Act
      const dto = CartMapper.toDto(cart);
      const mappedCart = CartMapper.toDomain(dto);

      // Assert
      expect(mappedCart.id.value).toBe(cart.id.value);
      expect(mappedCart.customerId.value).toBe(cart.customerId.value);
      expect(mappedCart.items).toHaveLength(1);
      expect(mappedCart.items[0].productId.value).toBe(item.productId.value);
      expect(mappedCart.items[0].quantity.value).toBe(item.quantity.value);
    });
  });
});
