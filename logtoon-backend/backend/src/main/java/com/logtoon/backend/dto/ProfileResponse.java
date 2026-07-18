package com.logtoon.backend.dto;

import com.logtoon.backend.entity.UserProfile;
import lombok.Builder;

@Builder
public record ProfileResponse(
        Long id,
        String name,
        Long followerCount,
        Long followingCount,
        Long commentCount,
        Long readCount,
        Long watchlistCount,
        Long heartCount,
        String bio,
        String avatarFileName,
        Long userId
) {

    public static ProfileResponse toResponse(UserProfile profile){
        return ProfileResponse.builder().id(profile.getId()).name(profile.getName()).followerCount(profile.getFollowerCount()).followingCount(profile.getFollowingCount()).commentCount(profile.getCommentCount()).readCount(profile.getReadCount()).watchlistCount(profile.getWatchlistCount()).heartCount(profile.getHeartCount()).bio(profile.getBio()).avatarFileName(profile.getAvatarFileName()).userId(profile.getAppUser().getId()).build();
    }
}
