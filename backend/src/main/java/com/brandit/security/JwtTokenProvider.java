package com.brandit.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${app.jwt.secret:}")
    private String jwtSecret;

    @Value("${app.jwt.expiration:86400000}")
    private long jwtExpiration;

    @Value("${app.jwt.refresh-expiration:604800000}")
    private long refreshExpiration;

    private static final String DEFAULT_DEV_SECRET = "YourSuperSecretKeyForBrandItJwtTokenMinimum256BitLengthRequired2024";
    private SecretKey resolvedSigningKey;

    @jakarta.annotation.PostConstruct
    public void init() {
        String trimmed = (jwtSecret != null) ? jwtSecret.trim() : "";
        String dbUrl = System.getenv("DATABASE_URL");
        boolean isProduction = (dbUrl != null && (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")));

        if (trimmed.isEmpty() || DEFAULT_DEV_SECRET.equals(trimmed)) {
            if (isProduction) {
                log.error("❌ [SECURITY ERROR] Insecure or default JWT_SECRET detected in production! Set a custom JWT_SECRET environment variable.");
                throw new IllegalStateException("A unique, secure JWT_SECRET environment variable is mandatory in production.");
            } else {
                log.warn("⚠️ [DEV NOTICE] Using development fallback JWT key. Set JWT_SECRET in production.");
                resolvedSigningKey = Keys.hmacShaKeyFor(DEFAULT_DEV_SECRET.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            }
        } else {
            resolvedSigningKey = Keys.hmacShaKeyFor(trimmed.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        }
    }

    private SecretKey getSigningKey() {
        return resolvedSigningKey;
    }

    public String generateAccessToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("JWT token is unsupported: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("JWT token is malformed: {}", e.getMessage());
        } catch (Exception e) {
            log.warn("JWT validation failed: {}", e.getMessage());
        }
        return false;
    }
}
