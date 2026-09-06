package com.aibudgetguardian.controller;

import com.aibudgetguardian.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealthStatus() {
        Map<String, Object> health = Map.of(
                "status", "UP",
                "service", "AI Budget Guardian Backend",
                "version", "1.0.0",
                "environment", "Production / Development Ready"
        );
        return ResponseEntity.ok(ApiResponse.success(health, "System backend operational"));
    }
}
