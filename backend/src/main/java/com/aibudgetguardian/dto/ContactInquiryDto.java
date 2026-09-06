package com.aibudgetguardian.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactInquiryDto {

    private UUID id;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    private String organization;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Message details are required")
    private String message;

    private String status;
    private LocalDateTime createdAt;
}
