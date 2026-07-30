package com.brandit.config;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
@Slf4j
public class DatabaseConfig {

    @Value("${DATABASE_URL:${spring.datasource.url:jdbc:h2:mem:branditdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=PostgreSQL}}")
    private String rawDatabaseUrl;

    @Value("${DATABASE_USERNAME:${spring.datasource.username:sa}}")
    private String dbUsername;

    @Value("${DATABASE_PASSWORD:${spring.datasource.password:}}")
    private String dbPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariDataSource dataSource = new HikariDataSource();

        String url = rawDatabaseUrl;
        if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
            log.info("Railway PostgreSQL database URL detected. Formatting for JDBC...");
            url = url.replaceFirst("^(postgres|postgresql)://", "jdbc:postgresql://");
            dataSource.setDriverClassName("org.postgresql.Driver");
        } else {
            log.info("Using H2 or standard JDBC URL: {}", url);
            dataSource.setDriverClassName("org.h2.Driver");
        }

        dataSource.setJdbcUrl(url);
        if (dbUsername != null && !dbUsername.isBlank()) {
            dataSource.setUsername(dbUsername);
        }
        if (dbPassword != null) {
            dataSource.setPassword(dbPassword);
        }

        return dataSource;
    }
}
