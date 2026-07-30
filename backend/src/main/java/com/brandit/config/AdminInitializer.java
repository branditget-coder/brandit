package com.brandit.config;

import com.brandit.entity.User;
import com.brandit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String ADMIN_EMAIL = "raghavdhir1510@gmail.com";

    @Override
    public void run(String... args) {
        userRepository.findByEmail(ADMIN_EMAIL).ifPresentOrElse(
            user -> {
                log.info("Admin user {} found. Updating credentials and role...", ADMIN_EMAIL);
                user.setFirstName("Raghav");
                user.setLastName("Dhir");
                user.setPhone("+918264452182");
                user.setPassword(passwordEncoder.encode("raghav@manav"));
                user.setRole(User.Role.ADMIN);
                user.setEmailVerified(true);
                userRepository.save(user);
                log.info("Admin user {} successfully verified and assigned ROLE_ADMIN.", ADMIN_EMAIL);
            },
            () -> {
                log.info("Admin user {} not found. Creating official Admin account...", ADMIN_EMAIL);
                User admin = User.builder()
                        .firstName("Raghav")
                        .lastName("Dhir")
                        .email(ADMIN_EMAIL)
                        .phone("+918264452182")
                        .password(passwordEncoder.encode("raghav@manav"))
                        .role(User.Role.ADMIN)
                        .provider(User.AuthProvider.LOCAL)
                        .emailVerified(true)
                        .currentRole("Tech Handler & Lead Admin")
                        .bio("BrandIt Official System Administrator")
                        .build();
                userRepository.save(admin);
                log.info("Official Admin account created for {} with ROLE_ADMIN.", ADMIN_EMAIL);
            }
        );
    }
}
