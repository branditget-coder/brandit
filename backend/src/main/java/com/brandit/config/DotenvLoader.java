package com.brandit.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class DotenvLoader {

    @PostConstruct
    public void loadEnv() {
        List<String> potentialPaths = List.of(
                ".env",
                "backend/.env",
                "../.env",
                "../../.env"
        );

        for (String path : potentialPaths) {
            File file = new File(path);
            if (file.exists() && file.isFile() && file.canRead()) {
                log.info("Loading environment variables from local file: {}", file.getAbsolutePath());
                try (BufferedReader reader = new BufferedReader(new FileReader(file, StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        if (eqIdx > 0) {
                            String key = line.substring(0, eqIdx).trim();
                            String val = line.substring(eqIdx + 1).trim();
                            // Strip matching quotes if present
                            if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
                                val = val.substring(1, val.length() - 1);
                            }
                            if (System.getProperty(key) == null && System.getenv(key) == null) {
                                System.setProperty(key, val);
                            }
                        }
                    }
                } catch (Exception e) {
                    log.warn("Could not read .env file from {}: {}", path, e.getMessage());
                }
                break; // Stop after first matched .env file
            }
        }
    }
}
