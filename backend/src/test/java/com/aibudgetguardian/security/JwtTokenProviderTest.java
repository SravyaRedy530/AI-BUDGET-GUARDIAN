package com.aibudgetguardian.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private final String secret = "404E635266556A586E3272357538782F413F4428472B4B6250655368566D5971";

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(secret, 900000, 604800000);
    }

    @Test
    void shouldGenerateAndValidateAccessToken() {
        UUID userId = UUID.randomUUID();
        CustomUserDetails userDetails = new CustomUserDetails(
                userId,
                "admin@aibudget.gov.in",
                "encodedPassword",
                "Super Admin",
                null,
                "ACTIVE",
                List.of(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"), new SimpleGrantedAuthority("budget:manage"))
        );

        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        String token = jwtTokenProvider.generateAccessToken(auth);

        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals("admin@aibudget.gov.in", jwtTokenProvider.getEmailFromToken(token));
        assertEquals("ACCESS", jwtTokenProvider.getTokenType(token));
    }

    @Test
    void shouldGenerateAndValidateRefreshToken() {
        UUID userId = UUID.randomUUID();
        CustomUserDetails userDetails = new CustomUserDetails(
                userId,
                "auditor@aibudget.gov.in",
                "encodedPassword",
                "Lead Auditor",
                null,
                "ACTIVE",
                List.of(new SimpleGrantedAuthority("ROLE_AUDITOR"))
        );

        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        assertNotNull(refreshToken);
        assertTrue(jwtTokenProvider.validateToken(refreshToken));
        assertEquals("auditor@aibudget.gov.in", jwtTokenProvider.getEmailFromToken(refreshToken));
        assertEquals("REFRESH", jwtTokenProvider.getTokenType(refreshToken));
    }
}
