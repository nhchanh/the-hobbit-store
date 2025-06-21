package chanhnguyen.thehobbitstore.product.service;

import lombok.AllArgsConstructor;
import java.util.Optional;
import org.springframework.stereotype.Service;

import chanhnguyen.thehobbitstore.product.model.aggregate.product.Product;
import chanhnguyen.thehobbitstore.product.model.valueobject.product.ProductId;
import chanhnguyen.thehobbitstore.product.repository.ProductRepository;

@Service
@AllArgsConstructor
public class ProductService {
	private final ProductRepository productRepo;

    public Product createProduct(Product product) {
        return productRepo.insert(product);
    }

    public Product updateProduct(Product product) {
		productRepo.update(product);
        return product;
    }

    public void deleteProduct(ProductId id) {
        productRepo.deleteById(id);
    }

    public Optional<Product> getOneById(ProductId id) {
        return productRepo.getOneById(id);
    }
}
