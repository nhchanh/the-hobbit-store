# Unit Testing Guide for The Hobbit Store UI

## 📍 **Current Test Status**

- **Test Infrastructure**: ✅ Complete (Jest + React Testing Library)
- **Test Configuration**: ✅ Complete (jest.config.js, jest.setup.js)
- **Test Structure**: ✅ Created (domain, components, integration, e2e)
- **Example Tests**: ✅ Created (domain, component, integration examples)

## 📁 **Test Organization**

```
src/tests/
├── __mocks__/                   # Mock implementations
├── domain/                      # Domain layer tests
│   ├── Money.test.ts           # Value object tests
│   ├── Cart.test.ts            # Aggregate tests
│   └── CartItem.test.ts        # Entity tests
├── components/                  # Component tests
│   ├── Button.test.tsx         # Atom component tests
│   ├── ProductCard.test.tsx    # Molecule component tests
│   └── ShoppingCart.test.tsx   # Organism component tests
├── integration/                 # Integration tests
│   ├── CartApplicationService.test.ts
│   ├── ProductQueries.test.ts
│   └── ReduxIntegration.test.ts
├── e2e/                        # End-to-end tests
│   └── UserJourney.test.ts
└── types.d.ts                  # Test type definitions
```

## 🧪 **Test Types and Strategies**

### **1. Domain Layer Tests**
**Focus**: Business logic, domain rules, value object validation

```typescript
// Example: Value Object Tests
describe('Money Value Object', () => {
  it('should validate positive amounts', () => {
    const money = Money.of(100, 'USD');
    expect(money.amount).toBe(100);
  });

  it('should throw for negative amounts', () => {
    expect(() => Money.of(-10, 'USD')).toThrow(ValidationError);
  });
});

// Example: Aggregate Tests
describe('Cart Aggregate', () => {
  it('should add items correctly', () => {
    const cart = Cart.create(customerId);
    const item = CartItem.create(productId, quantity, price);

    cart.addItem(item);

    expect(cart.items).toHaveLength(1);
    expect(cart.calculateTotal()).toEqual(expectedTotal);
  });
});
```

### **2. Component Tests**
**Focus**: Rendering, user interactions, accessibility

```typescript
// Example: Atom Component Tests
describe('Button Component', () => {
  it('should render with correct variant', () => {
    render(<Button variant="primary">Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600');
  });

  it('should handle click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### **3. Integration Tests**
**Focus**: Layer interactions, data flow, API integration

```typescript
// Example: Application Service Integration
describe('Cart Application Service', () => {
  it('should integrate domain and infrastructure layers', async () => {
    const result = await cartService.addItemToCart(params);

    expect(result).toBeDefined();
    expect(mockApiClient.addItem).toHaveBeenCalled();
  });
});
```

### **4. React Query Tests**
**Focus**: Server state management, caching, mutations

```typescript
// Example: Query Hook Tests
describe('useProductSearch', () => {
  it('should fetch products successfully', async () => {
    const { result } = renderHook(() => useProductSearch('test'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(5);
  });
});
```

## 🔧 **Test Commands**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- Money.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should validate"

# Run tests for specific directory
npm test -- src/tests/domain/
```

## 📊 **Coverage Requirements**

### **Coverage Thresholds**
- **Global**: 80% (branches, functions, lines, statements)
- **Domain Layer**: 90% (business logic critical)
- **Application Layer**: 85% (orchestration logic)
- **Components**: 75% (UI behavior)

### **Coverage Reports**
```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/lcov-report/index.html
```

## 🎯 **Testing Best Practices**

### **1. Domain Tests**
- Test business rules and invariants
- Test value object validation
- Test aggregate behavior
- Use domain language in test descriptions

### **2. Component Tests**
- Test user interactions
- Test accessibility features
- Test error states and edge cases
- Use semantic queries (`getByRole`, `getByLabelText`)

### **3. Integration Tests**
- Test actual data flow
- Mock external dependencies
- Test error handling
- Verify mapping between layers

### **4. Mocking Strategy**
- Mock external dependencies (APIs, localStorage)
- Don't mock domain logic
- Use real implementations for integration tests
- Create reusable test utilities

## 🚀 **Running Tests**

### **Development Workflow**
1. Write failing test (Red)
2. Implement minimal code (Green)
3. Refactor while keeping tests green (Refactor)

### **CI/CD Integration**
```bash
# In CI pipeline
npm run test:coverage
npm run lint
npm run type-check
npm run build
```

## 📝 **Test Documentation**

### **Test Naming Convention**
```typescript
describe('ComponentName or FeatureName', () => {
  describe('specific behavior group', () => {
    it('should do something specific when condition', () => {
      // Test implementation
    });
  });
});
```

### **Test Structure (AAA Pattern)**
```typescript
it('should add item to cart when valid product provided', () => {
  // Arrange - Set up test data and conditions
  const cart = Cart.create(customerId);
  const item = CartItem.create(productId, quantity, price);

  // Act - Execute the behavior being tested
  cart.addItem(item);

  // Assert - Verify the expected outcome
  expect(cart.items).toHaveLength(1);
  expect(cart.calculateTotal()).toEqual(expectedTotal);
});
```

## 🔍 **Debugging Tests**

### **Common Commands**
```bash
# Debug specific test
npm test -- --testNamePattern="specific test" --verbose

# Run with debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# Watch mode for TDD
npm run test:watch
```

### **VS Code Integration**
Install Jest extension for VS Code to run and debug tests directly in the editor.

## 📚 **Testing Resources**

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Kent C. Dodds Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

## ✅ **Next Steps**

1. **Create domain tests** for all value objects and aggregates
2. **Add component tests** for atomic design components
3. **Write integration tests** for application services
4. **Set up E2E tests** for critical user journeys
5. **Configure CI/CD pipeline** with test automation
6. **Add performance tests** for React Query hooks
7. **Create visual regression tests** with Storybook

---

**Remember**: Tests are documentation of your code's behavior. Write them for the next developer (including future you)!
