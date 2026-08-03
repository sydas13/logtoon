package com.logtoon.backend.service;

import com.logtoon.backend.dto.requests.PostRequest;
import com.logtoon.backend.dto.responses.PostResponse;
import com.logtoon.backend.entity.*;
import com.logtoon.backend.exception.ResourceNotFoundException;
import com.logtoon.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final ImageService imageService;
    private final CategoryRepository categoryRepository;
    private final CuisineRepository cuisineRepository;
    private final TagRepository tagRepository;
    private final PostRepository postRepository;
    private final AppUserRepository appUserRepository;


    public PostResponse createPost(PostRequest request, String username){

        UserProfile profile=appUserRepository.findByUsername(username).orElseThrow(()->new ResourceNotFoundException("Please register as an user first")).getProfile();

        List<String> savedImages= request.images().stream().map(imageService::saveImage).toList();
        Set<Category> postCategories=request.categories().stream().map(categoryName->categoryRepository.findByName(categoryName).orElseThrow(()->new ResourceNotFoundException("Category not found with name: "+ categoryName))).collect(Collectors.toSet());
        Set<Cuisine> postCuisines=request.cuisines().stream().map(cuisineName->cuisineRepository.findByName(cuisineName).orElseThrow(()->new ResourceNotFoundException("Cuisine not found with name: "+ cuisineName))).collect(Collectors.toSet());
        Set<Tag> postTags=request.tags().stream().map(tagName->tagRepository.findByName(tagName).orElseThrow(()->new ResourceNotFoundException("Tag not found with name: "+ tagName))).collect(Collectors.toSet());

        Post newPost= Post.builder().rating(request.rating()).moneySpent(request.moneySpent()).review(request.review()).locationDetails(request.location()).imageFiles(savedImages).profile(profile).categories(postCategories).cuisines(postCuisines).tags(postTags).build();

        Post savedPost=postRepository.save(newPost);
        return PostResponse.toResponse(savedPost);
    }
}
