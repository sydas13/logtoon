package com.logtoon.backend.dto.requests;

import jakarta.validation.constraints.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public record PostRequest (
@Min(1)
@Max(10)
@NotNull
Integer rating,
@NotNull
BigDecimal moneySpent,
@NotBlank(message = "Review cannot be empty")
@Size(min=20, message = "Review must be at least 8 characters")
String review,
@NotBlank(message = "Location cannot be empty")
String location,
@NotEmpty
List<MultipartFile> images,
@NotEmpty
List<String> categories,
@NotEmpty
List<String> cuisines,
@NotEmpty
List<String> tags
){
}
