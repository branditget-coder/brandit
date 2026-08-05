package com.brandit.config;

import com.brandit.entity.User;
import com.brandit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public static class TeamMemberSeed {
        String firstName;
        String lastName;
        String email;
        String phone;
        User.Role role;
        String title;

        public TeamMemberSeed(String firstName, String lastName, String email, String phone, User.Role role, String title) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.phone = phone;
            this.role = role;
            this.title = title;
        }
    }

    private static final List<TeamMemberSeed> OFFICIAL_TEAM_MEMBERS = List.of(
            new TeamMemberSeed("Raghav", "Dhir", "raghavdhir1510@gmail.com", "+918264452182", User.Role.ADMIN, "Lead Tech Strategist & Admin"),
            new TeamMemberSeed("Hritika", "Seth", "sethhritika@gmail.com", "+918708231539", User.Role.TEAM, "LinkedIn Manager & Lead Consultant"),
            new TeamMemberSeed("Kritika", "Dhawan", "dhawankritika866@gmail.com", "+916284318951", User.Role.TEAM, "Customer Outreach & Operations"),
            new TeamMemberSeed("Stuti", "Sharma", "bhardwajstuti101@gmail.com", "+919015470950", User.Role.TEAM, "Human Resource Manager"),
            new TeamMemberSeed("Yash", "Jain", "yashjainnn13@gmail.com", "+919024469496", User.Role.TEAM, "Finance & Accounting Lead")
    );

    @Override
    public void run(String... args) {
        for (TeamMemberSeed seed : OFFICIAL_TEAM_MEMBERS) {
            userRepository.findByEmailIgnoreCase(seed.email).ifPresentOrElse(
                user -> {
                    log.info("Official Team Member {} ({}) found. Ensuring TEAM/ADMIN access role...", seed.email, seed.firstName);
                    user.setFirstName(seed.firstName);
                    user.setLastName(seed.lastName);
                    if (user.getPhone() == null || user.getPhone().isBlank()) {
                        user.setPhone(seed.phone);
                    }
                    user.setRole(seed.role);
                    user.setEmailVerified(true);
                    userRepository.save(user);
                },
                () -> {
                    log.info("Creating official Team Account for {} ({}) with role {}...", seed.email, seed.firstName, seed.role);
                    User teamMember = User.builder()
                            .firstName(seed.firstName)
                            .lastName(seed.lastName)
                            .email(seed.email)
                            .phone(seed.phone)
                            .password(passwordEncoder.encode("brandit@team2026"))
                            .role(seed.role)
                            .provider(User.AuthProvider.LOCAL)
                            .emailVerified(true)
                            .currentRole(seed.title)
                            .bio("Official BrandIt Core Team Specialist")
                            .build();
                    userRepository.save(teamMember);
                }
            );
        }
    }
}
