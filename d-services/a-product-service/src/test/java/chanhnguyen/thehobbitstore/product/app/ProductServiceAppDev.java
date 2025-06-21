package chanhnguyen.thehobbitstore.product.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.testcontainers.junit.jupiter.Testcontainers;

import chanhnguyen.thehobbitstore.product.app.config.TestContainersConfig;

@Testcontainers
@SpringBootApplication(scanBasePackages = { "chanhnguyen.thehobbitstore.product" })
@SpringBootTest
public class ProductServiceAppDev {
	/**
	 * This is the main entry point for the Product Service application in development mode.
	 * It uses Testcontainers to run the application with a PostgreSQL database.
	 *
	 * @param args command line arguments
	 */
	public static void main(String[] args) {
		//SpringApplication.run(ProductServiceAppDev.class, args);
		SpringApplication.from(
			ProductServiceAppDev::main)
				.with(TestContainersConfig.class)
				.run(args);
	}
}