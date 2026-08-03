package com.logtoon.backend.config;

import com.logtoon.backend.entity.Category;
import com.logtoon.backend.entity.Cuisine;
import com.logtoon.backend.entity.Tag;
import com.logtoon.backend.repository.CategoryRepository;
import com.logtoon.backend.repository.CuisineRepository;
import com.logtoon.backend.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class StartConfig implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final CuisineRepository cuisineRepository;
    private final TagRepository tagRepository;
    private static final List<String> DEFAULT_CATEGORIES=List.of("street-food","restaurant","momo","biryani");
    private static final List<String> DEFAULT_CUISINES=List.of("indian","chinese","japanese","korean","thai","italian");
    private static final List<String> DEFAULT_TAGS=List.of("affordable","vegetarian-friendly","newly-opened");

    @Override
    public void run(String... args) throws Exception {
        for(String categoryName: DEFAULT_CATEGORIES){
            categoryRepository.findByName(categoryName).orElseGet(()->categoryRepository.save(Category.builder().name(categoryName).build()));
        }

        for(String cuisineName: DEFAULT_CUISINES){
            cuisineRepository.findByName(cuisineName).orElseGet(()->cuisineRepository.save(Cuisine.builder().name(cuisineName).build()));
        }

        for(String tagName: DEFAULT_TAGS){
            tagRepository.findByName(tagName).orElseGet(()->tagRepository.save(Tag.builder().name(tagName).build()));
        }
    }
}
