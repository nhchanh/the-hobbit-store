package chanhnguyen.thehobbitstore.product.repository;

import lombok.NoArgsConstructor;

import chanhnguyen.thehobbitstore.product.model.util.UlidUtils;

@NoArgsConstructor
public class RepositoryBase {

    public String generateULID() {
        return UlidUtils.generateUlid();
    }
}
