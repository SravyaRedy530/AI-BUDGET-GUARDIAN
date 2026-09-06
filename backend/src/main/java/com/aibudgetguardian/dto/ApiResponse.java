package com.aibudgetguardian.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {

    private boolean success;
    private int status;
    private String message;
    private T data;
    private List<ErrorDetail> errors;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .status(200)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> success(T data) {
        return success(data, "Success");
    }

    public static <T> ApiResponse<T> error(int status, String message, List<ErrorDetail> errors) {
        return ApiResponse.<T>builder()
                .success(false)
                .status(status)
                .message(message)
                .errors(errors)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> error(int status, String message) {
        return error(status, message, null);
    }
}
