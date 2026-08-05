package com.logtoon.backend.dto.responses;
import com.logtoon.backend.entity.Category;
import com.logtoon.backend.entity.Cuisine;
import com.logtoon.backend.entity.Post;
import com.logtoon.backend.entity.Tag;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Builder
public record PostResponse(
    Long id,
    Integer rating,
    BigDecimal moneySpent,
    String review,
    String location,
    List<String> imageFiles,
    Long profileId,
    String avatarFile,
    String profileName,
    String username,
    Set<String> categories,
    Set <String> cuisines,
    Set<String> tags
) {

    public static PostResponse toResponse(Post post){
        Set<String> categories= post.getCategories().stream().map(Category::getName).collect(Collectors.toSet());
        Set<String> cuisines= post.getCuisines().stream().map(Cuisine::getName).collect(Collectors.toSet());
        Set<String> tags= post.getTags().stream().map(Tag::getName).collect(Collectors.toSet());

        return PostResponse.builder().id(post.getId()).rating(post.getRating()).moneySpent(post.getMoneySpent()).review(post.getReview()).location(post.getLocationDetails()).imageFiles(post.getImageFiles()).profileId(post.getProfile().getId()).avatarFile(post.getProfile().getAvatarFileName()).profileName(post.getProfile().getName()).username(post.getProfile().getAppUser().getUsername()).categories(categories).cuisines(cuisines).tags(tags).build();
    }
}
