package com.logtoon.backend.service;

import com.logtoon.backend.dto.requests.AdjectivesFilterRequest;
import com.logtoon.backend.dto.requests.PostRequest;
import com.logtoon.backend.dto.responses.PostAdjectivesResponse;
import com.logtoon.backend.dto.responses.PostResponse;
import com.logtoon.backend.entity.*;
import com.logtoon.backend.exception.ResourceNotFoundException;
import com.logtoon.backend.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
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
    private final PostLikeRepository postLikeRepository;
    private final PostSaveRepository postSaveRepository;
    private final AppUserRepository appUserRepository;

    @PersistenceContext
    private EntityManager entityManager;

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
            return PostResponse.toResponse(savedPost,false,false);
        }catch (Exception e){
            savedImages.forEach(imageService::deleteImage);
            throw  e;
        }
    }

    public Page<PostResponse> getFilteredPostsByUsername(String username,List<String> cuisines, List<String> categories, List<String> tags, int minimumRating, int page, int size, String sortBy, String sortDirection){

        UserProfile profile=appUserRepository.findByUsername(username).orElseThrow(()->new ResourceNotFoundException("User does not exist")).getProfile();

        Sort sort=sortDirection.equalsIgnoreCase("desc")?Sort.by(sortBy).descending():Sort.by(sortBy).ascending();

        Pageable pageable= PageRequest.of(page,size,sort);

        List<AdjectivesFilterRequest> adjectivesFilterRequests = List.of(
                new AdjectivesFilterRequest("cuisines", cuisines),
                new AdjectivesFilterRequest("categories", categories),
                new AdjectivesFilterRequest("tags", tags)
        );

        Page<Post> posts= postRepository.findAll(PostSpecification.columnFilter(adjectivesFilterRequests,minimumRating, profile.getId()),pageable);
        Set<Long> postIds=posts.stream().map(Post::getId).collect(Collectors.toSet());
        Set<Long> likedPostIds=postLikeRepository.findLikedPostIds(profile.getAppUser().getId(),postIds);
        Set<Long> savedPostIds=postSaveRepository.findSavedPostIds(profile.getAppUser().getId(),postIds);

        return posts.map(post -> PostResponse.toResponse(post,likedPostIds.contains(post.getId()), savedPostIds.contains(post.getId())));
    }

    public PostAdjectivesResponse getPostAdjectives(){
        return PostAdjectivesResponse.toResponse(categoryRepository.findAll(),cuisineRepository.findAll(),tagRepository.findAll());
    }

    public Page<PostResponse> getFilteredPosts(List<String> cuisines, List<String> categories, List<String> tags, int minimumRating, int page, int size, String sortBy, String sortDirection, String username){
        Sort sort=sortDirection.equalsIgnoreCase("desc")?Sort.by(sortBy).descending():Sort.by(sortBy).ascending();

        Pageable pageable= PageRequest.of(page,size,sort);

        List<AdjectivesFilterRequest> adjectivesFilterRequests = List.of(
                new AdjectivesFilterRequest("cuisines", cuisines),
                new AdjectivesFilterRequest("categories", categories),
                new AdjectivesFilterRequest("tags", tags)
        );
        Page<Post> posts= postRepository.findAll(PostSpecification.columnFilter(adjectivesFilterRequests,minimumRating,null),pageable);
        Set<Long> likedPostIds;
        Set<Long> savedPostIds;

        if(username!=null){
            AppUser appUser=appUserRepository.findByUsername(username).orElse(null);
            if (appUser!=null) {
                Long userId= appUser.getId();
                Set<Long> postIds = posts.stream().map(Post::getId).collect(Collectors.toSet());
                likedPostIds = postLikeRepository.findLikedPostIds(userId, postIds);
                savedPostIds= postSaveRepository.findSavedPostIds(userId, postIds);
            } else {
                likedPostIds = new HashSet<>();
                savedPostIds=new HashSet<>();
            }
        } else {
            likedPostIds = new HashSet<>();
            savedPostIds= new HashSet<>();
        }

        return posts.map(post->PostResponse.toResponse(post, likedPostIds.contains(post.getId()), savedPostIds.contains(post.getId())));
    }

    @Transactional
    public PostResponse likePost(String username, Long postId){
        AppUser user=appUserRepository.findByUsername(username).orElseThrow(()->new ResourceNotFoundException("Please register as an user first"));
        Post post=postRepository.findById(postId).orElseThrow(()->new ResourceNotFoundException("Post does not exist"));

        PostLike postLike=PostLike.builder().user(user).post(post).createdAt(LocalDateTime.now()).build();

        postLikeRepository.save(postLike);

        postRepository.incrementLikes(postId);

        entityManager.refresh(post);

        return PostResponse.toResponse(post, postLikeRepository.existsLike(user.getId(), postId), postSaveRepository.existsSave(user.getId(), postId));
    }

    @Transactional
    public PostResponse dislikePost(String username, Long postId) {
        AppUser user=appUserRepository.findByUsername(username).orElseThrow(()->new ResourceNotFoundException("Please register as an user first"));
        Post post=postRepository.findById(postId).orElseThrow(()->new ResourceNotFoundException("Post does not exist"));

        postLikeRepository.deleteByUserIdAndPostId(user.getId(), postId);

        postRepository.decrementLikes(postId);

        entityManager.refresh(post);

        return PostResponse.toResponse(post, postLikeRepository.existsLike(user.getId(), postId), postSaveRepository.existsSave(user.getId(), postId));
    }

    @Transactional
    public PostResponse savePost(String username, Long postId){
        AppUser user=appUserRepository.findByUsername(username).orElseThrow(()->new ResourceNotFoundException("Please register as an user first"));
        Post post=postRepository.findById(postId).orElseThrow(()->new ResourceNotFoundException("Post does not exist"));

        PostSave postSave= PostSave.builder().user(user).post(post).createdAt(LocalDateTime.now()).build();

        postSaveRepository.save(postSave);

        postRepository.incrementSaves(postId);

        entityManager.refresh(post);

        return PostResponse.toResponse(post, postLikeRepository.existsLike(user.getId(), postId), postSaveRepository.existsSave(user.getId(), postId));
    }

    @Transactional
    public PostResponse unsavePost(String username, Long postId){
        AppUser user=appUserRepository.findByUsername(username).orElseThrow(()->new ResourceNotFoundException("Please register as an user first"));
        Post post=postRepository.findById(postId).orElseThrow(()->new ResourceNotFoundException("Post does not exist"));

        postSaveRepository.deleteByUserIdAndPostId(user.getId(), postId);

        postRepository.decrementSaves(postId);

        entityManager.refresh(post);

        return PostResponse.toResponse(post, postLikeRepository.existsLike(user.getId(), postId), postSaveRepository.existsSave(user.getId(), postId));
    }
}
