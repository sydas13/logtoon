package com.logtoon.backend.dto.responses;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String message,
        String description
) {
}
