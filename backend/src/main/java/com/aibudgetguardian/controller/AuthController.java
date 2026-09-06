package com.aibudgetguardian.controller;

import com.aibudgetguardian.dto.*;
import com.aibudgetguardian.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register-company")
    public ResponseEntity<ApiResponse<LoginResponse>> registerCompany(
            @Valid @RequestBody RegisterCompanyRequest request,
            HttpServletRequest servletRequest) {
        String ipAddress = servletRequest.getRemoteAddr();
        LoginResponse response = authService.registerCompany(request, ipAddress);
        return ResponseEntity.ok(ApiResponse.success(response, "Company / Organization registered successfully as Admin Owner"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest servletRequest) {
        String ipAddress = servletRequest.getRemoteAddr();
        LoginResponse response = authService.login(request, ipAddress);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        LoginResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Token refreshed successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> me(@AuthenticationPrincipal UserDetails userDetails) {
        UserDto user = authService.getCurrentUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(user, "Current user profile retrieved"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Successfully logged out", "Logout successful"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset instructions sent to your email", "Reset instructions sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password successfully reset", "Password reset successful"));
    }
}
