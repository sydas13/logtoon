package com.logtoon.backend.dto.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @Email(message = "Enter a valid email")
        @NotBlank
        String email,
        @NotBlank(message = "Username cannot be empty")
        String username,
        @NotBlank(message = "Enter a valid password")
        @Size(min=8,max=100, message = "Password must be at least 8 characters")
        String password) {
}
