package com.brandit.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseMigrationConfig implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            // Drop any existing rigid foreign key constraint on bookings table
            jdbcTemplate.execute(
                "DO $$ " +
                "DECLARE r RECORD; " +
                "BEGIN " +
                "  FOR r IN ( " +
                "    SELECT constraint_name " +
                "    FROM information_schema.table_constraints " +
                "    WHERE table_name = 'bookings' AND constraint_type = 'FOREIGN KEY' " +
                "  ) LOOP " +
                "    EXECUTE 'ALTER TABLE bookings DROP CONSTRAINT IF EXISTS ' || quote_ident(r.constraint_name); " +
                "  END LOOP; " +
                "END $$;"
            );

            // Re-add foreign key constraint with ON DELETE CASCADE
            jdbcTemplate.execute(
                "ALTER TABLE bookings ADD CONSTRAINT fk_bookings_user_id " +
                "FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE"
            );
            log.info("✅ Successfully applied CASCADE DELETE to PostgreSQL bookings(user_id) table.");
        } catch (Exception e) {
            log.info("Database schema migration status: {}", e.getMessage());
        }
    }
}
