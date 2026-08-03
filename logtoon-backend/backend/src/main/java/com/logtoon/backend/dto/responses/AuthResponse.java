package com.logtoon.backend.dto.responses;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
