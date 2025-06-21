package chanhnguyen.thehobbitstore.product.model.valueobject;

import de.huxhorn.sulky.ulid.ULID;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import org.apache.commons.lang3.StringUtils;

@AllArgsConstructor
@EqualsAndHashCode
@Getter
public final class Id {
	@NotNull
	private final ULID.Value value;

	public String value() {
		return value.toString();
	}

	public static Id of(String id) {
		return new Id(ULID.parseULID(StringUtils.upperCase(id)));
	}

	public static Id random() {
		return new Id(new ULID().nextValue());
	}
}
