package com.logtoon.backend.dto;

import com.logtoon.backend.entity.AppUser;
import lombok.Builder;

@Builder
public record UserResponse(
       Long id,
       String email,
       String username,
       String role,
       Long profileId
) {

    public static UserResponse toResponse(AppUser user){
        return UserResponse.builder().id(user.getId()).email(user.getEmail()).username(user.getUsername()).role(user.getRole().name()).profileId(user.getProfile().getId()).build();
    }
}
