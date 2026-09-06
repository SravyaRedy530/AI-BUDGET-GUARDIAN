package com.aibudgetguardian.controller;

import com.aibudgetguardian.dto.LoginRequest;
import com.aibudgetguardian.entity.Role;
import com.aibudgetguardian.entity.User;
import com.aibudgetguardian.repository.RoleRepository;
import com.aibudgetguardian.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        roleRepository.deleteAll();

        Role adminRole = roleRepository.save(Role.builder().code("SUPER_ADMIN").name("Super Admin").build());

        User adminUser = User.builder()
                .email("admin@aibudget.gov.in")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .fullName("System Admin")
                .status("ACTIVE")
                .roles(Set.of(adminRole))
                .build();
        userRepository.save(adminUser);
    }

    @Test
    void healthEndpointShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("UP"));
    }

    @Test
    void loginWithValidCredentialsShouldReturnTokens() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .email("admin@aibudget.gov.in")
                .password("Password123!")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.user.email").value("admin@aibudget.gov.in"));
    }

    @Test
    void loginWithInvalidCredentialsShouldReturn401() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .email("admin@aibudget.gov.in")
                .password("WrongPassword")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }
}
