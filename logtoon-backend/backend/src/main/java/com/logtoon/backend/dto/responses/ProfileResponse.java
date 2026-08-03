package com.logtoon.backend.dto.responses;

import com.logtoon.backend.entity.UserProfile;
import lombok.Builder;

@Builder
public record ProfileResponse(
        Long id,
        String name,
        Long followerCount,
        Long followingCount,
        Long placesVisited,
        Long heartCount,
        String badge,
        String bio,
        String avatarFileName,
        Long userId
) {

    public static ProfileResponse toResponse(UserProfile profile){
        return ProfileResponse.builder().id(profile.getId()).name(profile.getName()).followerCount(profile.getFollowerCount()).followingCount(profile.getFollowingCount()).placesVisited(profile.getPlacesVisited()).heartCount(profile.getHeartCount()).badge(profile.getBadge().toString()).bio(profile.getBio()).avatarFileName(profile.getAvatarFileName()).userId(profile.getAppUser().getId()).build();
    }
}
