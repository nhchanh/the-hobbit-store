package chanhnguyen.thehobbitstore.product.model.util;

import de.huxhorn.sulky.ulid.ULID;

public class UlidUtils {
    private static final ULID ULID_GENERATOR = new ULID();

    private UlidUtils() {
    }

    /*
     * Generates a new ULID (Universally Unique Lexicographically Sortable Identifier) as String.
     */
    public static String generateUlid() {
        return ULID_GENERATOR.nextValue().toString();
    }
}
