package chanhnguyen.hoppy.product.app;

import org.flywaydb.core.Flyway;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.JdbcConnectionDetails;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.utility.DockerImageName;


/**
 * TODO: will start the service with testcontainers and Karate test together
 */
@TestConfiguration(proxyBeanMethods = false)
public class HobbitStoreAppWithTestContainers {

	@Bean
    @ServiceConnection
    PostgreSQLContainer<?> postgresContainer() {
        //log.info("start postgres container");
        return new PostgreSQLContainer<>(DockerImageName.parse("postgres:latest"))
                .withLogConsumer(new Slf4jLogConsumer(LoggerFactory.getLogger(
					HobbitStoreAppWithTestContainers.class)))
			       .withDatabaseName("online-shopping-db")
                .withUsername("online-shopping-user")
                .withPassword("password")
                .withReuse(true)
                ;
    }

    @Bean(initMethod = "migrate")
    public Flyway flyway(JdbcConnectionDetails jdbcConnectionDetails) {
        //log.info("Flyway: PostgreSQL conn: \n\t\tUrl: {} \n\t\t Username: {} \n\t\t Password: {}",
		// jdbcConnectionDetails.getJdbcUrl(),
        //         jdbcConnectionDetails.getUsername(),
        //         jdbcConnectionDetails.getPassword());

        return new Flyway(Flyway.configure()
                .baselineOnMigrate(true)
                .dataSource(jdbcConnectionDetails.getJdbcUrl(),
                        jdbcConnectionDetails.getUsername(),
                        jdbcConnectionDetails.getPassword()));
    }
}
