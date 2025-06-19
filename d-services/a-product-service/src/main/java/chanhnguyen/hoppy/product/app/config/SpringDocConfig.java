package chanhnguyen.hoppy.product.app.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringDocConfig {
	@Bean
	public OpenAPI customOpenAPI() {
		return new OpenAPI()
				.components(new Components())
				.info(new AppplicationInfo()
						.title("The Hobbit Online Store API")
						.version("1.0.0"));
	}

	private static class AppplicationInfo extends Info {
	}
}
