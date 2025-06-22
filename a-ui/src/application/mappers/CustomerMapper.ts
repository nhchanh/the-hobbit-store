import { Customer } from '../../domain/aggregates/customer/Customer';
import { CustomerId, CustomerName } from '../../domain/valueobjects/customer/CustomerValues';
import { Email } from '../../domain/valueobjects/shared/Email';
import { PhoneNumber } from '../../domain/valueobjects/shared/PhoneNumber';
import { Address } from '../../domain/valueobjects/shared/Address';
import { Id } from '../../domain/valueobjects/shared/Id';
import { CreatedAt, UpdatedAt } from '../../domain/valueobjects/shared/Timestamps';
import { CustomerDto, AddressDto, CustomerPreferencesDto } from '../dto/CustomerDto';

export class CustomerMapper {
  static toDto(customer: Customer): CustomerDto {
    return {
      id: customer.id.value.value,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email.value,
      phoneNumber: customer.phoneNumber?.value,
      dateOfBirth: customer.dateOfBirth?.toISOString(),
      gender: customer.gender,
      status: customer.status,
      addresses: customer.addresses.map(this.addressToDto),
      preferences: this.preferencesToDto(customer.preferences),
      loyaltyPoints: customer.loyaltyPoints,
      membershipTier: customer.membershipTier,
      createdAt: customer.createdAt.value.toISOString(),
      updatedAt: customer.updatedAt.value.toISOString()
    };
  }

  static toDomain(dto: CustomerDto): Customer {
    const customerId = new CustomerId(Id.of(dto.id));
    const email = new Email(dto.email);
    const phoneNumber = dto.phoneNumber ? new PhoneNumber(dto.phoneNumber) : undefined;
    const dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined;

    const addresses = dto.addresses?.map(this.addressToDomain) || [];
    const preferences = this.preferencesToDomain(dto.preferences);

    return Customer.reconstitute(
      customerId,
      dto.firstName,
      dto.lastName,
      email,
      phoneNumber,
      dateOfBirth,
      dto.gender,
      dto.status,
      addresses,
      preferences,
      dto.loyaltyPoints,
      dto.membershipTier,
      CreatedAt.of(new Date(dto.createdAt)),
      UpdatedAt.of(new Date(dto.updatedAt))
    );
  }

  private static addressToDto(address: any): AddressDto {
    return {
      id: address.id,
      customerId: address.customerId.value.value,
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company,
      streetLine1: address.streetLine1,
      streetLine2: address.streetLine2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phoneNumber: address.phoneNumber?.value,
      isDefault: address.isDefault
    };
  }

  private static addressToDomain(dto: AddressDto): any {
    return {
      id: dto.id,
      customerId: new CustomerId(Id.of(dto.customerId)),
      type: dto.type,
      firstName: dto.firstName,
      lastName: dto.lastName,
      company: dto.company,
      streetLine1: dto.streetLine1,
      streetLine2: dto.streetLine2,
      city: dto.city,
      state: dto.state,
      postalCode: dto.postalCode,
      country: dto.country,
      phoneNumber: dto.phoneNumber ? new PhoneNumber(dto.phoneNumber) : undefined,
      isDefault: dto.isDefault
    };
  }

  private static preferencesToDto(preferences: any): CustomerPreferencesDto {
    return {
      currency: preferences.currency,
      language: preferences.language,
      timezone: preferences.timezone,
      emailNotifications: preferences.emailNotifications,
      smsNotifications: preferences.smsNotifications,
      marketingEmails: preferences.marketingEmails,
      newsletter: preferences.newsletter
    };
  }

  private static preferencesToDomain(dto: CustomerPreferencesDto): any {
    return {
      currency: dto.currency,
      language: dto.language,
      timezone: dto.timezone,
      emailNotifications: dto.emailNotifications,
      smsNotifications: dto.smsNotifications,
      marketingEmails: dto.marketingEmails,
      newsletter: dto.newsletter
    };
  }
}
