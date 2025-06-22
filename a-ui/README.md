# The Hobbit Online Store - UI Module

A modern, type-safe Next.js frontend application implementing Domain-Driven Design (DDD) principles with React Query for server state management and Redux Toolkit for client state management.

## 🎯 Overview

This is the frontend UI module of The Hobbit Online Store e-commerce platform, built with a strict Domain-Driven Design architecture that ensures maintainable, scalable, and testable code. The application demonstrates modern React patterns, clean architecture principles, and comprehensive TypeScript integration.

## 🏗️ Architecture

### **DDD Layered Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │  Next.js Pages  │ │ Atomic Design   │ │ React Components│ │
│  │                 │ │ Components      │ │                 │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │  Redux Slices   │ │ React Query     │ │ Domain Hooks    │ │
│  │ (Client State)  │ │ (Server State)  │ │                 │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │ App Services    │ │  DTOs & Mappers │ │ Query Hooks     │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │  API Clients    │ │ Query Client    │ │ Cache Management│ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    DOMAIN LAYER                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │   Aggregates    │ │  Value Objects  │ │  Domain Events  │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### **Key Design Principles**

- **Domain Independence**: Domain layer has no external dependencies
- **Clean Architecture**: Dependencies point inward toward the domain
- **Immutability**: All domain objects and value objects are immutable
- **Type Safety**: Strict TypeScript with comprehensive type definitions
- **Separation of Concerns**: Clear boundaries between layers
- **CQRS Pattern**: Separate read and write operations with React Query

## 🚀 Technology Stack

### **Core Technologies**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Strict type safety throughout
- **React 18** - Modern React with concurrent features
- **Tailwind CSS** - Utility-first styling

### **State Management**
- **React Query (TanStack Query)** - Server state management and caching
- **Redux Toolkit** - Client state management with predictable updates
- **Zustand** - Lightweight state for UI components (where needed)

### **Architecture & Patterns**
- **Domain-Driven Design (DDD)** - Strategic and tactical patterns
- **Atomic Design** - Component hierarchy (Atoms → Molecules → Organisms → Pages)
- **Clean Architecture** - Dependency inversion and separation of concerns
- **CQRS** - Command Query Responsibility Segregation

### **Development Tools**
- **ESLint** - Code linting with strict rules
- **Prettier** - Code formatting
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Storybook** - Component development and documentation

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   ├── (shop)/                   # Shopping route group
│   ├── admin/                    # Admin routes
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── providers.tsx             # App providers
│
├── components/                   # Presentation Layer (Atomic Design)
│   ├── atoms/                    # Basic building blocks
│   │   ├── Button/               # Button component
│   │   ├── Input/                # Input component
│   │   ├── Spinner/              # Loading spinner
│   │   └── Image/                # Image component
│   ├── molecules/                # Composite components
│   │   ├── ProductCard/          # Product display card
│   │   ├── CartItem/             # Cart item component
│   │   └── Navigation/           # Navigation bar
│   ├── organisms/                # Complex components
│   │   ├── ProductGrid/          # Product listing
│   │   └── ShoppingCart/         # Cart management
│   └── pages/                    # Page-level components
│       ├── ProductsPage/         # Products listing page
│       ├── CartPage/             # Shopping cart page
│       └── ReactQueryDemoPage/   # Demo integration
│
├── domain/                       # Domain Layer (DDD Core)
│   ├── aggregates/               # Aggregate Roots
│   │   ├── cart/                 # Cart aggregate
│   │   │   ├── Cart.ts           # Cart aggregate root
│   │   │   └── CartItem.ts       # Cart item entity
│   │   ├── product/              # Product aggregate
│   │   │   └── Product.ts        # Product aggregate root
│   │   ├── customer/             # Customer aggregate
│   │   ├── order/                # Order aggregate
│   │   ├── review/               # Review aggregate
│   │   ├── inventory/            # Inventory aggregate
│   │   └── promotion/            # Promotion aggregate
│   ├── valueobjects/             # Value Objects
│   │   ├── shared/               # Common value objects
│   │   │   ├── Id.ts             # Base identifier
│   │   │   ├── Money.ts          # Monetary values
│   │   │   ├── Email.ts          # Email addresses
│   │   │   ├── PhoneNumber.ts    # Phone numbers
│   │   │   └── Address.ts        # Physical addresses
│   │   ├── cart/                 # Cart-specific values
│   │   ├── product/              # Product-specific values
│   │   ├── customer/             # Customer-specific values
│   │   └── [other domains]/      # Domain-specific values
│   ├── errors/                   # Domain Errors
│   │   └── DomainErrors.ts       # Custom domain exceptions
│   └── events/                   # Domain Events (future)
│
├── application/                  # Application Layer
│   ├── dto/                      # Data Transfer Objects
│   │   ├── CartDto.ts            # Cart API contracts
│   │   ├── ProductDto.ts         # Product API contracts
│   │   └── [other domains].ts    # Domain DTOs
│   ├── mappers/                  # Domain ↔ DTO Mapping
│   │   ├── CartMapper.ts         # Cart mapping logic
│   │   ├── ProductMapper.ts      # Product mapping logic
│   │   └── [other domains].ts    # Domain mappers
│   └── services/                 # Application Services
│       ├── CartApplicationService.ts    # Cart use cases
│       ├── ProductApplicationService.ts # Product use cases
│       └── [other domains].ts           # Domain services
│
├── infrastructure/               # Infrastructure Layer
│   ├── api/                      # API Clients
│   │   ├── ApiClient.ts          # Base HTTP client
│   │   ├── CartApiClient.ts      # Cart API endpoints
│   │   ├── ProductApiClient.ts   # Product API endpoints
│   │   └── [other domains].ts    # Domain API clients
│   └── query/                    # React Query Configuration
│       ├── queryClient.ts        # Query client setup
│       └── hooks/                # Query hooks
│           ├── useProductQueries.ts  # Product queries
│           ├── useCartQueries.ts     # Cart queries
│           ├── useReviewQueries.ts   # Review queries
│           └── index.ts              # Hook exports
│
├── store/                        # Redux State Management
│   ├── store.ts                  # Store configuration
│   ├── slices/                   # Domain slices
│   │   ├── cart/                 # Cart state
│   │   ├── product/              # Product state
│   │   ├── customer/             # Customer state
│   │   ├── order/                # Order state
│   │   ├── ui/                   # UI state
│   │   └── auth/                 # Authentication state
│   └── middleware/               # Custom middleware
│       ├── persistence.ts        # State persistence
│       ├── logging.ts            # Development logging
│       ├── analytics.ts          # User analytics
│       └── api.ts                # API error handling
│
├── hooks/                        # Custom React Hooks
│   ├── domain/                   # Domain-specific hooks
│   │   ├── useCart.ts            # Cart business logic
│   │   ├── useProduct.ts         # Product business logic
│   │   └── [other domains].ts    # Domain hooks
│   └── lifecycle/                # Lifecycle hooks
│       └── useApplicationLifecycle.ts # App lifecycle
│
├── types/                        # TypeScript Definitions
│   ├── common.ts                 # Common types
│   └── api.ts                    # API types
│
└── utils/                        # Utility Functions
    ├── validation/               # Validation utilities
    ├── formatting/               # Data formatting
    └── constants/                # Application constants
```

## 🎯 Domain Model

### **Core Aggregates**

1. **Product Aggregate**
   - Product (root), Category, Inventory, ProductImage
   - Value Objects: ProductId, ProductName, Price, Rating

2. **Cart Aggregate**
   - Cart (root), CartItem, Promotion application
   - Value Objects: CartId, Quantity, ItemPrice, CartStatus

3. **Customer Aggregate**
   - Customer (root), Wishlist, Address, ContactInfo
   - Value Objects: CustomerId, CustomerName, Email, PhoneNumber

4. **Order Aggregate**
   - Order (root), Payment, OrderHistory, Shipping
   - Value Objects: OrderId, OrderStatus, ShippingAddress

5. **Review Aggregate**
   - Review (root), Rating, ReviewImage
   - Value Objects: ReviewId, Rating, ReviewComment

## 🔄 State Management Strategy

### **React Query (Server State)**
- Product searches and details
- Cart operations and synchronization
- Order management and tracking
- Review fetching and submission
- Inventory status checking

### **Redux Toolkit (Client State)**
- Authentication state
- UI state (modals, notifications)
- Application preferences
- Form state management
- Navigation state

### **Component Local State**
- Form inputs and validation
- UI interactions (hover, focus)
- Component-specific toggles
- Temporary display states

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+
- npm or yarn or pnpm
- TypeScript knowledge
- React experience

### **Installation**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

### **Development Server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🧪 Unit Testing & Testing Strategy

The Hobbit Store UI follows a comprehensive testing strategy aligned with our Domain-Driven Design architecture. Our testing approach ensures reliability, maintainability, and confidence in refactoring across all layers of the application.

### **Testing Infrastructure** ✅

- **Test Framework**: Jest with React Testing Library
- **Configuration**: Fully configured with Next.js integration
- **TypeScript Support**: Complete type safety in tests
- **Coverage Reporting**: Automated coverage analysis with thresholds

### **Test Organization** 📁

```
src/tests/
├── __mocks__/                   # Mock implementations and test utilities
├── domain/                      # Domain layer tests (value objects, aggregates)
│   └── Money.test.ts           # ✅ Example: Value object validation tests
├── components/                  # Component tests (atoms, molecules, organisms)
│   └── Button.test.tsx         # ✅ Example: Atom component interaction tests
├── integration/                 # Integration tests (cross-layer interactions)
│   └── CartApplicationService.test.ts # ✅ Example: Service integration tests
├── e2e/                        # End-to-end tests (user workflows)
└── types.d.ts                  # Test type definitions
```

### **Testing Layers & Strategy**

#### **1. Domain Layer Tests** 🏛️
- **Focus**: Business logic, domain rules, value object validation
- **Coverage**: 90% threshold (business logic is critical)
- **Examples**: Money value object validation, Cart aggregate behavior
- **Pattern**: Test domain invariants and business rules without external dependencies

#### **2. Component Tests** ⚛️
- **Focus**: User interactions, rendering behavior, accessibility
- **Coverage**: 75% threshold (UI behavior verification)
- **Examples**: Button click handling, form validation, responsive behavior
- **Pattern**: Test user-visible behavior using semantic queries

#### **3. Integration Tests** 🔗
- **Focus**: Layer interactions, data flow, API integration
- **Coverage**: 85% threshold (orchestration logic)
- **Examples**: Application services with domain + infrastructure integration
- **Pattern**: Test actual data flow between layers with controlled mocks

#### **4. React Query Tests** 🚀
- **Focus**: Server state management, caching, mutations
- **Coverage**: Real query hooks with mock API responses
- **Examples**: Product search queries, cart mutation operations
- **Pattern**: Test caching behavior and optimistic updates

### **Test Commands** 🛠️

```bash
# Development workflow
npm test                    # Run all tests
npm run test:watch          # Run tests in watch mode (TDD)
npm run test:coverage       # Generate coverage report

# Specific test execution
npm test -- Money.test.ts   # Run specific test file
npm test -- --testNamePattern="should validate"  # Run tests by pattern
npm test -- src/tests/domain/  # Run tests in specific directory

# Coverage analysis
npm run test:coverage       # Generate detailed coverage report
open coverage/lcov-report/index.html  # View HTML coverage report
```

### **Coverage Requirements** 📊

| Layer | Threshold | Rationale |
|-------|-----------|-----------|
| **Domain Layer** | 90% | Business logic is critical for correctness |
| **Application Layer** | 85% | Orchestration logic needs verification |
| **Components** | 75% | UI behavior should be tested |
| **Overall** | 80% | Balanced coverage across all layers |

### **Testing Best Practices** ✨

- **TDD Workflow**: Red → Green → Refactor cycle
- **Domain Language**: Use business terminology in test descriptions
- **AAA Pattern**: Arrange → Act → Assert structure
- **Semantic Queries**: Use `getByRole`, `getByLabelText` for component tests
- **Real Integration**: Use actual implementations in integration tests
- **Mock Strategy**: Mock external dependencies, not domain logic

### **Detailed Testing Documentation** 📚

For comprehensive testing guidelines, patterns, and examples:

**→ [Complete Testing Guide](src/tests/README.md)**

This detailed guide includes:
- Test file organization and naming conventions
- Layer-specific testing patterns and examples
- Mocking strategies and test utilities
- Debugging and troubleshooting tips
- CI/CD integration and coverage reporting
- Code examples for each testing layer

## 🧪 Testing Strategy

### **Test Types**
- **Unit Tests**: Domain logic, pure functions, utilities
- **Component Tests**: React components with React Testing Library
- **Integration Tests**: Hooks, services, API integration
- **E2E Tests**: User workflows with Playwright

### **Test Commands**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Build & Deployment

### **Build Commands**

```bash
# Production build
npm run build

# Start production server
npm start

# Analyze bundle
npm run analyze

# Export static site
npm run export
```

### **Environment Variables**

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=The Hobbit Store

# Multi-tenancy
NEXT_PUBLIC_DEFAULT_TENANT_ID=01JY9X0AN101C86WKVJXANZ567
NEXT_PUBLIC_DEFAULT_ENV_ID=DEVELOPMENT

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SERVICE_WORKER=true
```

## 🎨 Component Library

### **Atomic Design Hierarchy**

#### **Atoms (Basic Components)**
- `Button` - Various styles and states
- `Input` - Form inputs with validation
- `Spinner` - Loading indicators
- `Image` - Optimized image component

#### **Molecules (Composite Components)**
- `ProductCard` - Product display with actions
- `CartItem` - Cart item with quantity controls
- `Navigation` - App navigation with cart badge

#### **Organisms (Complex Components)**
- `ProductGrid` - Product listing with filters
- `ShoppingCart` - Complete cart management
- `CheckoutForm` - Multi-step checkout process

#### **Pages (Full Pages)**
- `ProductsPage` - Product catalog
- `CartPage` - Shopping cart management
- `CheckoutPage` - Order completion

## 🔧 Development Guidelines

### **Code Style**
- Use strict TypeScript configuration
- Follow functional programming patterns
- Implement immutable data structures
- Use descriptive naming conventions
- Add comprehensive JSDoc comments

### **Component Guidelines**
- Keep components small and focused
- Use composition over inheritance
- Implement proper prop typing
- Handle loading and error states
- Include accessibility attributes

### **State Management**
- Use React Query for server state
- Use Redux for complex client state
- Keep local state minimal
- Implement optimistic updates
- Handle errors gracefully

### **Domain Modeling**
- Follow DDD tactical patterns
- Keep aggregates small and focused
- Use value objects for validation
- Implement domain events for integration
- Separate business logic from UI

## 📚 Documentation

- **[Architecture Guide](README-ARCHITECTURE.md)** - Detailed architecture documentation
- **[DDD Implementation Status](DDD_IMPLEMENTATION_STATUS.md)** - Current implementation status
- **API Documentation** - Backend API integration guide
- **Component Library** - Storybook component documentation

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow the coding standards** and write tests
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### **Pull Request Guidelines**
- Include comprehensive tests
- Update documentation as needed
- Follow the established code style
- Ensure all CI checks pass
- Add detailed description of changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🎯 Roadmap

### **Phase 1: Foundation** ✅
- [x] DDD architecture implementation
- [x] React Query integration
- [x] Redux state management
- [x] Atomic design component library
- [x] TypeScript strict configuration

### **Phase 2: Enhanced Features** 🚧
- [ ] Real-time cart synchronization
- [ ] Advanced search and filtering
- [ ] Wishlist management
- [ ] User authentication
- [ ] Order tracking

### **Phase 3: Optimization** 📋
- [ ] Performance optimizations
- [ ] Bundle size optimization
- [ ] SEO improvements
- [ ] Accessibility enhancements
- [ ] Progressive Web App features

### **Phase 4: Advanced Features** 📋
- [ ] Personalization engine
- [ ] Advanced analytics
- [ ] A/B testing framework
- [ ] Multi-language support
- [ ] Offline support

## 🌟 Key Features

- ✅ **Comprehensive DDD Implementation** - Full tactical DDD patterns
- ✅ **Modern React Stack** - Next.js 14, React 18, TypeScript
- ✅ **Dual State Management** - React Query + Redux Toolkit
- ✅ **Atomic Design Components** - Scalable component architecture
- ✅ **Type-Safe Development** - Strict TypeScript throughout
- ✅ **Clean Architecture** - Clear separation of concerns
- ✅ **Performance Optimized** - React Query caching and optimization
- ✅ **Developer Experience** - Hot reload, type checking, linting

## 📞 Support

For questions, issues, or contributions:

- **GitHub Issues** - Report bugs and request features
- **Documentation** - Comprehensive guides and examples
- **Code Reviews** - Collaborative development process
- **Architecture Discussions** - DDD and React best practices

---

**Built with ❤️ using Domain-Driven Design principles and modern React patterns**
