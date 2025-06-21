package chanhnguyen.thehobbitstore.product.app.config;

import chanhnguyen.thehobbitstore.product.model.valueobject.TenantId;

public class Tenant {
	private static final ThreadLocal<TenantId> TENANT_ID = new ThreadLocal<>();

	private Tenant() {
	}

	public static void setTenantId(TenantId tenantID) {
		TENANT_ID.set(tenantID);
	}

	public static TenantId getTenantId() {
		return TENANT_ID.get();
	}

	public static void clear() {
		TENANT_ID.remove();
	}
}
