package com.brandit.config;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
@Slf4j
public class DatabaseConfig {

    @Value("${DATABASE_URL:${spring.datasource.url:jdbc:h2:mem:branditdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=PostgreSQL}}")
    private String rawDatabaseUrl;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariDataSource dataSource = new HikariDataSource();

        String url = rawDatabaseUrl;
        if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
            log.info("Railway PostgreSQL database URL detected. Parsing connection parameters...");
            try {
                URI uri = new URI(url);
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();

                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
                dataSource.setJdbcUrl(jdbcUrl);
                dataSource.setDriverClassName("org.postgresql.Driver");

                if (uri.getUserInfo() != null) {
                    String[] userInfo = uri.getUserInfo().split(":");
                    if (userInfo.length > 0) {
                        dataSource.setUsername(userInfo[0]);
                    }
                    if (userInfo.length > 1) {
                        dataSource.setPassword(userInfo[1]);
                    }
                }
                log.info("Successfully configured PostgreSQL datasource for host: {}", host);
            } catch (Exception e) {
                log.error("Error parsing DATABASE_URL URI, falling back to direct string replacement", e);
                String formattedUrl = url.replaceFirst("^(postgres|postgresql)://", "jdbc:postgresql://");
                dataSource.setJdbcUrl(formattedUrl);
                dataSource.setDriverClassName("org.postgresql.Driver");
            }
        } else {
            log.info("Using H2 or standard JDBC URL: {}", url);
            dataSource.setJdbcUrl(url);
            dataSource.setDriverClassName("org.h2.Driver");
            dataSource.setUsername("sa");
            dataSource.setPassword("");
        }

        return dataSource;
    }
}
