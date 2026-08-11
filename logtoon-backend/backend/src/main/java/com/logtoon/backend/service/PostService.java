package com.logtoon.backend.service;

import com.logtoon.backend.dto.requests.AdjectivesFilterRequest;
import com.logtoon.backend.dto.requests.PostRequest;
import com.logtoon.backend.dto.responses.PostAdjectivesResponse;
import com.logtoon.backend.dto.responses.PostResponse;
import com.logtoon.backend.entity.*;
import com.logtoon.backend.exception.ResourceNotFoundException;
import com.logtoon.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

    @Transactional
    public PostResponse createPost(PostRequest request, String username){

        List<String> savedImages=new ArrayList<>();
        UserProfile profile=appUserRepository.findByUsername(username).orElseThrow(()->new ResourceNotFoundException("Please register as an user first")).getProfile();

        try {
            Set<Category> postCategories = request.categories().stream().map(categoryName -> categoryRepository.findByName(categoryName).orElseThrow(() -> new ResourceNotFoundException("Category not found with name: " + categoryName))).collect(Collectors.toSet());
            Set<Cuisine> postCuisines = request.cuisines().stream().map(cuisineName -> cuisineRepository.findByName(cuisineName).orElseThrow(() -> new ResourceNotFoundException("Cuisine not found with name: " + cuisineName))).collect(Collectors.toSet());
            Set<Tag> postTags = request.tags().stream().map(tagName -> tagRepository.findByName(tagName).orElseThrow(() -> new ResourceNotFoundException("Tag not found with name: " + tagName))).collect(Collectors.toSet());

            profile.setPlacesVisited(profile.getPlacesVisited() + 1);

            savedImages = request.images().stream().map(imageService::saveImage).toList();

            Post newPost = Post.builder().rating(request.rating()).moneySpent(request.moneySpent()).review(request.review()).createdAt(LocalDateTime.now()).locationDetails(request.location()).imageFiles(savedImages).profile(profile).categories(postCategories).cuisines(postCuisines).tags(postTags).build();

            Post savedPost = postRepository.save(newPost);
            return PostResponse.toResponse(savedPost);
        }catch (Exception e){
            savedImages.forEach(imageService::deleteImage);
            throw  e;
        }
    }

    public List<PostResponse> getPosts(String username){
        UserProfile profile=appUserRepository.findByUsername(username).orElseThrow(()->new ResourceNotFoundException("User does not exist")).getProfile();

        return profile.getPosts().stream().map(PostResponse::toResponse).toList();
    }

    public PostAdjectivesResponse getPostAdjectives(){
        return PostAdjectivesResponse.toResponse(categoryRepository.findAll(),cuisineRepository.findAll(),tagRepository.findAll());
    }

    public Page<PostResponse> getFilteredPosts(List<String> cuisines, List<String> categories, List<String> tags, int minimumRating, int page, int size, String sortBy, String sortDirection){
        Sort sort=sortDirection.equalsIgnoreCase("desc")?Sort.by(sortBy).descending():Sort.by(sortBy).ascending();

        Pageable pageable= PageRequest.of(page,size,sort);

        List<AdjectivesFilterRequest> adjectivesFilterRequests = List.of(
                new AdjectivesFilterRequest("cuisines", cuisines),
                new AdjectivesFilterRequest("categories", categories),
                new AdjectivesFilterRequest("tags", tags)
        );
        Page<Post> posts= postRepository.findAll(PostSpecification.columnFilter(adjectivesFilterRequests,minimumRating),pageable);

        return  posts.map(PostResponse::toResponse);

    }

}

// fetch post, post hook custom, make filters acceessible in profile posts as well