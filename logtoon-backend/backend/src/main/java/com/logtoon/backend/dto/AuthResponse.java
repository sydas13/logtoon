package com.logtoon.backend.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
