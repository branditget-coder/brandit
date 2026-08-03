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
            // Ensure all columns exist on bookings table
            jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_screenshot TEXT;");
            jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(255);");
            jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255);");
            jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS amount NUMERIC(19, 2);");
            jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes TEXT;");
            jdbcTemplate.execute("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS meeting_link VARCHAR(255);");
            log.info("✅ Verified and added missing columns to PostgreSQL bookings table.");
        } catch (Exception e) {
            log.warn("Bookings column schema migration notice: {}", e.getMessage());
        }

        try {
            // Ensure all columns exist on app_users table
            jdbcTemplate.execute("ALTER TABLE app_users ADD COLUMN IF NOT EXISTS phone VARCHAR(255);");
            jdbcTemplate.execute("ALTER TABLE app_users ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255);");
            jdbcTemplate.execute("ALTER TABLE app_users ADD COLUMN IF NOT EXISTS current_role VARCHAR(255);");
            jdbcTemplate.execute("ALTER TABLE app_users ADD COLUMN IF NOT EXISTS bio TEXT;");
            jdbcTemplate.execute("ALTER TABLE app_users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255);");
            log.info("✅ Verified and added missing columns to PostgreSQL app_users table.");
        } catch (Exception e) {
            log.warn("AppUsers column schema migration notice: {}", e.getMessage());
        }

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
