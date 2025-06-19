package chanhnguyen.hoppy.product.repository;


import chanhnguyen.hoppy.product.model.util.UlidUtils;

@NoArgsConstructor
public class RepositoryBase {

    public String generateULID() {
        return UlidUtils.generateUlid();
    }
}
