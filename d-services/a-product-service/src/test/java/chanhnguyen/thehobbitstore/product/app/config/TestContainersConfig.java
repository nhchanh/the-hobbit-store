package chanhnguyen.thehobbitstore.product.app.config;

import jakarta.annotation.PreDestroy;

import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.JdbcConnectionDetails;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.utility.DockerImageName;

import chanhnguyen.thehobbitstore.product.app.ProductServiceAppDev;

@Configuration(proxyBeanMethods = false)
public class TestContainersConfig {

    private static final Logger log = LoggerFactory.getLogger(TestContainersConfig.class);
    private PostgreSQLContainer<?> postgresContainer;

    @Bean
    @ServiceConnection
    @SuppressWarnings("resource") // TestContainer lifecycle managed by Spring and @PreDestroy
    PostgreSQLContainer<?> postgresContainer() {
        log.info("start postgres container");
        DockerImageName imageName = DockerImageName.parse("postgres:latest");
        this.postgresContainer = new PostgreSQLContainer<>(imageName)
                .withLogConsumer(new Slf4jLogConsumer(LoggerFactory.getLogger(
                    ProductServiceAppDev.class)))
                .withDatabaseName("online-shopping-db")
                .withUsername("online-shopping-user")
                .withPassword("password")
                .withReuse(true);
        return this.postgresContainer;
    }

    @PreDestroy
    public void cleanup() {
        if (this.postgresContainer != null) {
            this.postgresContainer.close();
        }
    }

    @Bean(initMethod = "migrate")
    public Flyway flyway(JdbcConnectionDetails jdbcConnectionDetails) {
        log.info("Flyway: PostgreSQL conn: \n\t\tUrl: {} \n\t\t Username: {} \n\t\t Password: {}",
                jdbcConnectionDetails.getJdbcUrl(),
                jdbcConnectionDetails.getUsername(),
                jdbcConnectionDetails.getPassword());

        return Flyway.configure()
                .dataSource(
                        jdbcConnectionDetails.getJdbcUrl(),
                        jdbcConnectionDetails.getUsername(),
                        jdbcConnectionDetails.getPassword())
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .load();
    }
}
