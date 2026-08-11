package com.logtoon.backend.dto.responses;

import com.logtoon.backend.entity.Category;
import com.logtoon.backend.entity.Cuisine;
import com.logtoon.backend.entity.Tag;
import lombok.Builder;

import java.util.List;

@Builder
public record PostAdjectivesResponse(
        List<String> categories,
        List<String> cuisines,
        List<String> tags
) {
    public static PostAdjectivesResponse toResponse(List<Category> categories, List<Cuisine> cuisines, List<Tag> tags){
        List<String> categoryNames=categories.stream().map(Category::getName).toList();
        List<String> cuisineNames=cuisines.stream().map(Cuisine::getName).toList();
        List<String> tagNames=tags.stream().map(Tag::getName).toList();

        return PostAdjectivesResponse.builder().categories(categoryNames).cuisines(cuisineNames).tags(tagNames).build();
    }
}
