# The Hobbit Online Store - UI Architecture

## **Domain-Driven Design (DDD) Structure**

This Next.js application follows strict Domain-Driven Design principles with clear separation of concerns:

### **Directory Structure**

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   ├── (shop)/                   # Shopping route group
│   ├── admin/                    # Admin routes
│   ├── api/                      # API routes
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
│
├── components/                   # Presentation Layer
│   ├── layout/                   # Layout components
│   ├── ui/                       # Reusable UI components
│   ├── forms/                    # Form components
│   ├── features/                 # Feature-specific components
│   │   ├── cart/
│   │   ├── product/
│   │   ├── customer/
│   │   └── checkout/
│   └── providers/                # Component providers
│
├── domain/                       # Domain Layer (DDD Core)
│   ├── aggregates/               # Aggregate Roots
│   │   ├── cart/
│   │   ├── product/
│   │   ├── customer/
│   │   ├── order/
│   │   └── review/
│   ├── valueobjects/             # Value Objects
│   │   ├── cart/
│   │   ├── product/
│   │   ├── customer/
│   │   ├── shared/
│   │   └── order/
│   ├── entities/                 # Domain Entities
│   ├── errors/                   # Domain Errors
│   ├── events/                   # Domain Events
│   └── services/                 # Domain Services
│
├── infrastructure/               # Infrastructure Layer
│   ├── api/                      # API clients
│   ├── persistence/              # Local storage, cache
│   ├── notifications/            # Notification services
│   └── external/                 # External service integrations
│
├── application/                  # Application Layer
│   ├── services/                 # Application Services
│   ├── handlers/                 # Command/Query handlers
│   ├── dto/                      # Data Transfer Objects
│   └── mappers/                  # Domain ↔ DTO mapping
│
├── store/                        # Redux State Management
│   ├── slices/                   # Redux slices by domain
│   │   ├── cart/
│   │   ├── product/
│   │   ├── customer/
│   │   ├── order/
│   │   └── ui/
│   ├── middleware/               # Custom middleware
│   ├── selectors/                # Reusable selectors
│   ├── types.ts                  # State type definitions
│   └── store.ts                  # Store configuration
│
├── hooks/                        # Custom React Hooks
│   ├── domain/                   # Domain-specific hooks
│   ├── ui/                       # UI-specific hooks
│   └── lifecycle/                # Lifecycle management hooks
│
├── utils/                        # Utility Functions
│   ├── validation/               # Validation utilities
│   ├── formatting/               # Formatting utilities
│   ├── constants/                # Application constants
│   └── helpers/                  # General helpers
│
├── styles/                       # Styling
│   ├── globals.css
│   ├── components.css
│   └── themes/
│
├── tests/                        # Testing
│   ├── __mocks__/
│   ├── domain/                   # Domain tests
│   ├── components/               # Component tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests
│
└── types/                        # Global TypeScript types
    ├── api.ts
    ├── common.ts
    └── environment.ts
```

### **Key Principles**

1. **Domain Independence**: Domain layer has no dependencies on external frameworks
2. **Clear Boundaries**: Each layer only depends on layers below it
3. **Immutability**: All domain objects are immutable
4. **Type Safety**: Strict TypeScript with no `any` types
5. **Test-Driven**: Each layer is fully testable in isolation
6. **Clean Architecture**: Dependencies point inward toward the domain

### **Aggregate Boundaries**

- **Product Aggregate**: Product, Category, Inventory, ProductImage
- **Cart Aggregate**: Cart, CartItem, Promotion application
- **Customer Aggregate**: Customer, Wishlist, Address, ContactInfo
- **Order Aggregate**: Order, Payment, OrderHistory, Shipping
- **Review Aggregate**: Review, Rating, ReviewImage

### **State Management Strategy**

- **Redux Toolkit**: For global application state
- **React Query**: For server state and caching
- **Local State**: For component-specific UI state
- **Domain Events**: For cross-aggregate communication
