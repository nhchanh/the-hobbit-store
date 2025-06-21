package chanhnguyen.thehobbitstore.product.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = { "chanhnguyen.thehobbitstore.product" })
public class ProductServiceAppDev {
	public static void main(String[] args) {
		SpringApplication.run(ProductServiceAppDev.class, args);
	}
}