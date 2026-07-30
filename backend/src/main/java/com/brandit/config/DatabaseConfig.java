package com.brandit.config;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Custom DataSource configuration that handles Railway's PostgreSQL URL format.
 * Railway provides DATABASE_URL as: postgresql://user:pass@host:port/db
 * JDBC requires:                    jdbc:postgresql://host:port/db (with separate user/pass)
 *
 * By NOT setting spring.datasource.url in application.properties, we prevent Spring
 * Boot's autoconfiguration from creating a broken DataSource bean before this one.
 */
@Configuration
@Slf4j
public class DatabaseConfig {

    @Value("${DATABASE_URL:none}")
    private String databaseUrl;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariDataSource ds = new HikariDataSource();

        if (!"none".equals(databaseUrl) && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://"))) {
            // ── Railway PostgreSQL path ──
            log.info("Railway PostgreSQL DATABASE_URL detected. Parsing URI...");
            try {
                URI uri = new URI(databaseUrl);
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String dbName = uri.getPath(); // e.g. "/railway"

                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + dbName;
                ds.setJdbcUrl(jdbcUrl);
                ds.setDriverClassName("org.postgresql.Driver");

                if (uri.getUserInfo() != null) {
                    String[] parts = uri.getUserInfo().split(":", 2);
                    ds.setUsername(parts[0]);
                    if (parts.length > 1) {
                        ds.setPassword(parts[1]);
                    }
                }

                // Connection pool settings for Railway
                ds.setMaximumPoolSize(5);
                ds.setMinimumIdle(1);
                ds.setConnectionTimeout(30000);
                ds.setIdleTimeout(600000);
                ds.setMaxLifetime(1800000);
                ds.setConnectionTestQuery("SELECT 1");

                log.info("PostgreSQL DataSource configured for host: {}:{}{}", host, port, dbName);

            } catch (Exception e) {
                log.error("Failed to parse DATABASE_URL as URI: {}. Error: {}", databaseUrl, e.getMessage());
                throw new RuntimeException("Invalid DATABASE_URL format: " + databaseUrl, e);
            }

        } else if (!"none".equals(databaseUrl) && databaseUrl.startsWith("jdbc:")) {
            // ── Standard JDBC URL (already formatted) ──
            log.info("Standard JDBC URL detected: {}", databaseUrl);
            ds.setJdbcUrl(databaseUrl);
            if (databaseUrl.contains("postgresql")) {
                ds.setDriverClassName("org.postgresql.Driver");
            } else {
                ds.setDriverClassName("org.h2.Driver");
                ds.setUsername("sa");
                ds.setPassword("");
            }

        } else {
            // ── Local H2 in-memory fallback ──
            log.info("No DATABASE_URL set. Using H2 in-memory database for local development.");
            ds.setJdbcUrl("jdbc:h2:mem:branditdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=PostgreSQL");
            ds.setDriverClassName("org.h2.Driver");
            ds.setUsername("sa");
            ds.setPassword("");
        }

        return ds;
    }
}
