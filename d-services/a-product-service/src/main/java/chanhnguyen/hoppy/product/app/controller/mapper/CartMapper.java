package chanhnguyen.hoppy.product.app.controller.mapper;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import chanhnguyen.hoppy.thehobbitstore.dto.CartDto;
import chanhnguyen.hoppy.thehobbitstore.dto.CartItemDto;
import chanhnguyen.hoppy.product.model.aggregate.cart.Cart;
import chanhnguyen.hoppy.product.model.aggregate.cart.CartItem;
import chanhnguyen.hoppy.product.model.valueobject.CreatedAt;
import chanhnguyen.hoppy.product.model.valueobject.UpdatedAt;
import chanhnguyen.hoppy.product.model.valueobject.cart.CartId;
import chanhnguyen.hoppy.product.model.valueobject.cart.CartItemId;
import chanhnguyen.hoppy.product.model.valueobject.cart.ItemPrice;
import chanhnguyen.hoppy.product.model.valueobject.cart.Quantity;
import chanhnguyen.hoppy.product.model.valueobject.cart.Status;
import chanhnguyen.hoppy.product.model.valueobject.customer.CustomerId;
import chanhnguyen.hoppy.product.model.valueobject.product.ProductId;


@Mapper(componentModel = "spring")
public interface CartMapper {
	CartMapper INSTANCE = Mappers.getMapper(CartMapper.class);

	@Mapping(target = "id", source = "id", qualifiedByName = "IdDtoToModel")
	@Mapping(target = "createdAt", qualifiedByName = "CreateAtDtoToModel")
	@Mapping(target = "updatedAt", qualifiedByName = "UpdateAtDtoToModel")
	@Mapping(target = "customerId", source = "customerId", qualifiedByName = "CustomerIdDtoToModel")
	@Mapping(target = "status.value", source = "status")
	@Mapping(target = "cartItems", source = "cartItems", qualifiedByName = "CartItemDtoListToModelList")
	Cart toEntity(CartDto dto);

	@Named("IdDtoToModel")
	default CartId mapIdDtoToModel(String value) {
		return value != null ? CartId.of(value) : null;
	}

	@Named("CreateAtDtoToModel")
	default CreatedAt mapCreateAtDtoToModel(String value) {
		return value != null ? CreatedAt.of(Instant.parse(value)) : null;
	}

	@Named("UpdateAtDtoToModel")
	default UpdatedAt mapUpdateAtDtoToModel(String value) {
		return value != null ? UpdatedAt.of(Instant.parse(value)) : null;
	}

	@Named("CustomerIdDtoToModel")
	default CustomerId mapCustomerIdDtoToModel(String value) {
		return value != null ? CustomerId.of(value) : null;
	}

	@Named("CartItemDtoToModel")
	default CartItem mapCartItemDtoToModel(CartItemDto dto) {

		if (dto == null) {
			return null;
		}

		return CartItem.builder()
				.id(dto.getId() == null ? null : CartItemId.of(dto.getId()))
				.cartId(dto.getCartId() == null ? null : CartId.of(dto.getCartId()))
				.productId(ProductId.of(dto.getProductId()))
				.quantity(Quantity.of(dto.getQuantity()))
				.itemPrice(ItemPrice.of(dto.getItemPrice()))
				.build();
	}

	@Named("CartItemDtoListToModelList")
	default List<CartItem> mapCartItemDtoListToModelList(List<CartItemDto> items) {
		if (items == null)
			return null;
		return items.stream().map(this::mapCartItemDtoToModel).collect(Collectors.toList());
	}

	@Mapping(target = "id", source = "id", qualifiedByName = "CardIdToDto")
	@Mapping(target = "customerId", source = "customerId", qualifiedByName = "CustomerIdDto")
	@Mapping(target = "status", source = "status"	, qualifiedByName = "StatusToDto")
	@Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "CreateAtDtoToModel")
	@Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "UpdateAtDtoToModel")
	@Mapping(target = "cartItems", source = "cartItems", qualifiedByName = "CartItemModelListToDtoList")
	CartDto toDto(Cart entity);

	@Named("CardIdToDto")
	default String mapCartIdToString(CartId id) {
		return id.value().value();
	}

	@Named("CustomerIdDto")
	default String mapCustomerIdToString(CustomerId id) {
		return id.value().value();
	}

	@Named("StatusToDto")
	default String mapStatusToString(Status status) {
		return status.value();
	}

	@Named("CreateAtDtoToModel")
	default String mapCreateAtToString(CreatedAt createdAt) {
		return createdAt.value().toString();
	}

	@Named("UpdateAtDtoToModel")
	default String mapUpdateAtToString(UpdatedAt updatedAt) {
		return updatedAt.value().toString();
	}

	@Named("CartItemModelListToDtoList")
	default List<CartItemDto> mapCartItemModelListToDtoList(List<CartItem> items) {
		if (items == null) return null;
		return items.stream().map(this::mapCartItemModelToDto).collect(Collectors.toList());
	}

	@Named("CartItemModelToDto")
	default CartItemDto mapCartItemModelToDto(CartItem item) {
		if (item == null) return null;
		return CartItemDto.builder()
			.id(item.getId().value().value())
			.cartId(item.getCartId().value().value())
			.productId(item.getProductId().value().value())
			.quantity(item.getQuantity().value())
			.itemPrice(item.getItemPrice().value())
			.build();
	}
}
