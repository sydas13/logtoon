package com.logtoon.backend.dto.requests;

import org.springframework.web.multipart.MultipartFile;

public record ProfileUpdateRequest
        (String name,
         String bio,
         MultipartFile avatar
) {
}
