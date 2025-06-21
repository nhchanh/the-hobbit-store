package chanhnguyen.thehobbitstore.product.app.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;
import com.intuit.karate.Results;
import com.intuit.karate.Runner;

public class KarateTestRunner {

	@Test
	public void runKarateTest() {
		try (PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(DockerImageName.parse("postgres:16-alpine"))) {
			postgres.start();

			// Karate will automatically load karate-config.js from the classpath
			// You can pass system properties to override config if needed
			System.setProperty("karate.env", "test");
			System.setProperty("spring.datasource.url", postgres.getJdbcUrl());
			System.setProperty("spring.datasource.username", postgres.getUsername());
			System.setProperty("spring.datasource.password", postgres.getPassword());

			Results results = Runner.path("classpath:chanhnguyen/thehobbitstore/product/app/controller/featureFiles")
					.outputCucumberJson(true)
					.outputHtmlReport(true)
					.debugMode(true)
					.reportDir("build/karate-reports")
					.parallel(1);
			assertEquals(0, results.getFailCount(), results.getErrorMessages());
		}
	}
}
