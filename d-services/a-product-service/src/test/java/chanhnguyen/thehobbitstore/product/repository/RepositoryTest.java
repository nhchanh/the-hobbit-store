package chanhnguyen.thehobbitstore.product.repository;

import static org.junit.Assert.assertTrue;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import chanhnguyen.thehobbitstore.product.app.ProductServiceApp;
import chanhnguyen.thehobbitstore.product.app.config.Environment;
import chanhnguyen.thehobbitstore.product.app.config.Tenant;
import chanhnguyen.thehobbitstore.product.model.aggregate.product.Product;
import chanhnguyen.thehobbitstore.product.model.valueobject.TenantId;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductId;

@Testcontainers
@SpringBootTest(classes = ProductServiceApp.class)
public class RepositoryTest {
    @Container
    @ServiceConnection // Automatically configures datasource properties
    @SuppressWarnings("resource") // Container is managed by Testcontainers framework
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:latest")
			.withDatabaseName("online-shopping-db")
			.withUsername("online-shopping-user")
			.withPassword("password")
			.withReuse(true); // Reuse the container across tests

    @Autowired
    private ProductRepository productRepo; // Example repository to test

    @BeforeEach
    void setUp() {
        // Set up tenant and environment context for the repository tests
        Tenant.setTenantId(TenantId.of("01JY9YQ96XTNEGQ9EZAK6PD6TR"));
        Environment.setEnvironmentId("TESTING");
    }

    @Test
    void testGetOneById() {
		Optional<Product> product = productRepo.getOneById(ProductId.of("01JY9X0AN101C86WKVJXANZ567"));
		assertTrue(product.isEmpty());
    }
}
