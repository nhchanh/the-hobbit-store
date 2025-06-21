package chanhnguyen.thehobbitstore.product.app.config;

public class Environment {
	private static final ThreadLocal<String> ENVIRONMENT = new ThreadLocal<>();

	private Environment() {
	}

	public static void setEnvironmentId(String env) {
		ENVIRONMENT.set(env);
	}

	public static String getEnvironmentId() {
		return ENVIRONMENT.get();
	}

	public static void clear() {
		ENVIRONMENT.remove();
	}
}
