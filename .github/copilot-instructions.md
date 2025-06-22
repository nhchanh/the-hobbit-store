# **Custom Instruction for GitHub Copilot**

## **The Hobbit Online Store application Overview**
The The Hobbit Online Store application provides a comprehensive web technologies solution for managing shopping carts in an e-commerce environment. It includes features for adding, removing, and updating items in the cart, as well as calculating totals and applying discounts. It include following objects:
- Customer (first name, last name, email, phone number, and address)
- Wishlist (a list of products that customers are interested in)
- Product (name, description, rating, price, and a list of image urls)
- Category (product categorization for easier navigation)
- Review (customer feedback on products)
- Inventory (stock management for products)
- Cart (a collection of products customer want to purchase, and they added by a customer to their shopping cart)
- Cart Item (a product in the cart with quantity and total price)
- Promotion (discounts and offers applicable to products or carts)
- Purchase Order (a finalized cart with customer details and payment information)
- Payment (payment details and status)
- Order (a record of a completed purchase with details such as order ID, customer ID, product IDs, quantities, total amount, and status)
- Order History (a record of past orders and their statuses)

## **What I want to accomplish with Copilot**
- Accelerate development by generating boilerplate code and repetitive tasks.
- Ensure adherence to best practices and architectural guidelines.
- Receive suggestions for code improvements, refactoring, and optimizations.
- Get help with writing and maintaining tests using TDD.
- Obtain guidance on integrating new technologies or frameworks.
- Generate and update documentation, API specs, and migration scripts.
- Facilitate onboarding for new team members with clear examples and templates.

## **Project The Hobbit Online Store goals**
1. Build a scalable and maintainable The Hobbit Online Store system.
2. Implement a user-friendly web interface for managing the shopping cart.
3. Provide a robust API for integrating with other services.
4. Ensure high test coverage and reliability through automated testing.
5. Optimize performance and resource usage for a seamless user experience.
6. Follow best practices for code quality, documentation, and version control.
7. Use modern technologies and frameworks to enhance development efficiency.
8. Implement a clean architecture to separate concerns and improve maintainability.
9. Ensure security and data protection through proper authentication and authorization mechanisms.
10. Provide comprehensive documentation for developers and users.
11. Support multi-tenancy and localization for a global audience.
12. Support multi environments (dev, test, prod) for deployment and testing.
13. Support multi devices (desktop, tablet, mobile) for user access.
14. Support multi browsers (Chrome, Firefox, Safari) for user access.

## **What I want to accomplish**
I am working on a project that involves the following technologies and processes:
- **Java**: Java version 24, Spring Boot, Spring DAO, Gradle, Lombok, MapStruct
- **Testing**: Karate Test, Test-Driven Development (TDD)
- **Database**: PostgreSQL, Flyway, Domain-Driven Design (DDD)
- **API First Development**: OpenAPI, Swagger

I want to:
1. Follow best practices for clean, maintainable, and scalable code.
2. Use **domain-driven design (DDD)** principles for modeling aggregates, entities, and value objects.
3. Write comprehensive tests (unit, integration, and end-to-end) using **test-driven development (TDD)**.
4. Generate and document APIs using **OpenAPI/Swagger**.
5. Optimize database schema and queries for performance and maintainability.
6. Don't use java primitive types in the domain model, use wrapper classes like value objects instead
7. Don't use primitive type of domain object, but use values object instead
8. Don't use @NoArgsConstructor of lombok in all classes
9. Don't use @Setter of lombok in all value objects
10. Use immutable features from Lombok
11. Organize java import statements in the following order: import java standard libraries, then third-party libraries, then other imports, and finally the chanhnguyen.hoppy.thehobbitstore package imports. And sort the imports in alphabetical order within each group.

---
## **The structure of the codebase**
- There are many submodules in the codebase, but the main module is `The Hobbit Online Store`
- The first submodules is #codebase/a-ui. This is a web UI module which is nextjs app
- The second submodule is #codebase/b-api. This is pure Java API module which contains the API endpoints
- The third submodule is #codebase/c-core. This is pure Java core module which contains common logic and utilities
- The fourth submodule is #codebase/d-services/04.1-hobbitstore-service. This is Java service module which contains implementation of the API endpoints and the business logic
- The fifth submodule is #codebase/e2e-test This is Karate test for end to end testing
- The sixth submodule is #codebase/pns-test This is Karate test for performance & sizing testing

## **The structure of the second submodule is #codebase/b-api**
- The #codebase/b-api module follows a RESTful architecture
- Contain java interfaces for defining the API endpoints and their request/response formats
- The interfaces are built with Spring Boot, Lombok, and Jakarta validation, OpenAPI annotations.
- The module is designed to be stateless and follows the principles of RESTful APIs.
- It uses DTOs (Data Transfer Objects) for data exchange between the client and server.
- The module integrates with the core services to perform business logic operations.
- Java package structure:
	- chanhnguyen.hoppy.thehobbitstore
	  - api
		- cartapi
		- customerapi
		- productapi
		- reviewapi
		- inventoryapi
		- orderapi
	  - dto
	  - exception

## **The structure of the second submodule is #codebase/c-core**
- #codebase/c-core module is pure java and no dependency libraries that has io such as disk id, and network io
- Contain common logic and utilities that are used across the project

## **The structure of the second submodule is #codebase/d-services/a-hobbitstore-service**
-#codebase/d-services/a-hobbitstore-service module is the implementation of the API endpoints and the business logic
- Contains domain models, value objects, services, and repositories, and rest controllers which Implement interfaces in the #codebase/b-api module.
-Build on top of Spring Boot, Spring JDBC, Lombok, Jakarta validation, MapStruct.
-Use Jakarta validation, and Lombok to validate not nullable, max or min length of string, and regex for email and phone number.
-Unit test with testng, test double, test container, and Mockito.
-Integration test with Spring boot test, test containers.
- package structure:
  - chanhnguyen.hoppy.thehobbitstore
	- app
	 - controller
	 - dto
	 - mapper
	 - config
	 - exception
	 - repository
	- model
	  - aggregate
		- cart
		- customer
		- order
		- product
		- promotion
		- review
		- tenant
		- wishlist
		- inventory
	  - valueobject
		- address
		- email
		- phone number
	  - util
	- service
	  - cartservice
	  - customerservice
	  - orderservice
	  - productservice
	  - promotionservice
	  - reviewservice
	  - tenantservice
	  - wishlistservice
	  - inventoryservice
- The Spring Boot application is configured to use the PostgreSQL database with Flyway for migrations.
- The application main class is located in the `chanhnguyen.hoppy.thehobbitstore` package.
- The application is configured to run on port 8080 by default.
- The default database connection to the PostgreSQL database is configured in the `application.properties` file with following properties:
  - spring.datasource.url=jdbc:postgresql://localhost:5432/online-shopping-db
  - spring.datasource.username=online-shopping-user
  - spring.datasource.password=password
  - spring.flyway.baseline-on-migrate=true
  - spring.flyway.enabled=true
  - spring.flyway.locations=classpath:db/migration
  - spring.jpa.hibernate.ddl-auto=none
  - spring.jpa.show-sql=true
  - spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect


## **How I want Copilot to help me**

### **Java Development**
- Use **Lombok** to reduce boilerplate code (e.g., getters, setters, builders).
- Use **MapStruct** for efficient and type-safe object mapping.
- Follow **Spring Boot** conventions for configuration, dependency injection, and RESTful APIs.
- Suggest **Gradle** configurations for dependencies, plugins, and build optimizations.
- Don't user Spring JPA
- Only import classes that are used in the code
- Use **Java 24** features and best practices.
- Follow **Java coding conventions** for naming, formatting, and structure.
- Use **Java naming conventions** for classes, methods, and variables.
- Use **DDD principles** to model aggregates, entities, and value objects.
- Use **Spring DAO** for data access and repository patterns.
- Don't use Java primitive types in the domain model, use wrapper classes like value objects instead.
- Use **Jakarta validation** for input validation and constraints.
- Use **TestNG** for unit testing and mocking frameworks like **Mockito** for test doubles.
- Use **Testcontainers** for integration testing with real database instances.
- Use **Spring Boot Test** for integration testing and context loading.

### **Testing**
- Follow **TDD** principles by writing tests before implementing features.
- Write **Karate tests** for API endpoints, including edge cases and error scenarios.
- Provide test cases for unit, integration, and end-to-end testing.

### **Database Schema requirements**
- Use **PostgreSQL** best practices for schema design, indexing, and query optimization.
- Suggest improvements for database migrations and ensure compatibility with DDD principles.
- Provide SQL scripts for data seeding and schema updates.
- shopping-cart-db is the name of the database
- Use **Flyway** for database migrations and version control.
- Use **DDD** principles to model aggregates, entities, and value objects.
- Use **PostgreSQL** as the database engine.
- Use **LUID** for unique identifiers in the database.
- There is one table for environment which have following columns: ID (VARCHAR(10)), Name (VARCHAR(50)), and Description (VARCHAR(255))
- There is one table for Tenant which have following columns: ID (ULID), Name (VARCHAR(50)), and Description (VARCHAR(255))
- Each other tables in schema will have a column for Environment ID (VARCHAR(10)) and Tenant ID (ULID)
- Each other tables in schema will have a compound primary key on ID and Environment ID (VARCHAR(10)), and Tenant ID (ULID).
- Use following PostgreSQL domain objects:
	- CREATE DOMAIN ulid AS VARCHAR(26) CONSTRAINT ulid_26_chars_length_and_uppercase_check CHECK (UPPER(VALUE) = VALUE AND LENGTH(VALUE) = 26);
	- CREATE DOMAIN env_id AS VARCHAR(10) CONSTRAINT env_id_10_chars_length_and_uppercase_check CHECK (UPPER(VALUE) = VALUE AND LENGTH(VALUE) >= 5);


## **The structure of the submodule #codebase/a-ui**
- The #codebase/ is a Next.js application
- It is designed to provide a user-friendly web interface for displaying product categories and managing the shopping cart.
- The application is built using Next.js, React, and TypeScript.
- The application follows best practices for Next.js development, static site generation, and API routes.
- The application is structured to separate concerns between components, pages, and API routes.
- The application uses **Tailwind CSS** for styling and responsive design.
- The application uses **Axios** for making API requests to the backend.
- The application uses **React Query** for data fetching and caching.
- The application uses **Jest** and **React Testing Library** for unit and integration testing.
- The application is configured to run on port 3000 by default.
- The application is configured to use the **TypeScript** compiler with strict type checking.
- The application is configured to use **ESLint** and **Prettier** for code quality and formatting.
- The application is configured to use **Redux** for state management.
- The application is designed to use Domain-Driven Design (DDD) principles to model the business domain and enforce boundaries between different contexts.
- The application is designed to be modular and extensible, allowing for easy addition of new features and components.
- The application is designed to clear lifecycle management for state, components, ensuring proper cleanup and resource management.
- The application is designed to have different lifecycle states to manage the user experience effectively:
  - **OnInit**: When the application is loading and initializing.
  - **OnLoading**: When data is being fetched from the API.
  - **OnClosing**: When the application is closing or navigating away.
  - **OnSubmitting**: When data is being submitted to the API.
- The application is configured to use **i18next** for internationalization and localization.
- The application is structured with the following directories:
  - `components`: Contains reusable React components.
  - `pages`: Contains Next.js pages and API routes.
  - `styles`: Contains global styles and Tailwind CSS configuration.
  - `utils`: Contains utility functions and constants.
  - `hooks`: Contains custom React hooks for managing state and side effects.
  - `context`: Contains React context providers for global state management.
  - `services`: Contains API service functions for making requests to the backend.
  - `tests`: Contains unit and integration tests for components and pages.
  - `model`: Contains domain models and value objects for the application. this contain business logic and data structures.



### **API Development**
- Generate **OpenAPI specifications** for APIs and ensure they are well-documented.
- Use **Swagger** for API documentation and testing.
- Ensure APIs follow RESTful principles and are versioned properly.

### **General Guidance**
- Provide code snippets, configurations, and examples for the above technologies.
- Suggest tools, libraries, or frameworks to improve productivity and code quality.
- Follow **clean code principles** and industry best practices.

---

## **Examples of Tasks I Expect Copilot to Help With**
1. Generate a entity class with **Lombok** annotations and **MapStruct** mappings.
2. Write a **Karate test** for a REST API endpoint, including setup and assertions.
3. Suggest a **Gradle build script** for a multi-module Spring Boot project.
4. Provide a **PostgreSQL migration script** for adding a new table or column.
5. Generate an **OpenAPI specification** for a new API endpoint.
6. Refactor code to align with **DDD principles**, such as creating aggregate roots or value objects.