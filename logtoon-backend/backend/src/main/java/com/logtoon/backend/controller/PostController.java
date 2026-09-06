package com.logtoon.backend.controller;

import com.logtoon.backend.dto.requests.AdjectivesFilterRequest;
import com.logtoon.backend.dto.requests.PostRequest;
import com.logtoon.backend.dto.responses.PostAdjectivesResponse;
import com.logtoon.backend.dto.responses.PostResponse;
import com.logtoon.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/logtoon/post")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @GetMapping("/post-adjectives")
    public ResponseEntity<PostAdjectivesResponse> getPostAdjectives(){
        return ResponseEntity.ok(postService.getPostAdjectives());
    }

    @GetMapping("/posts")
    public ResponseEntity<Page<PostResponse>> getFilteredPosts(@Nullable @AuthenticationPrincipal UserDetails userDetails, @RequestParam List<String> cuisines, @RequestParam List<String> categories, @RequestParam List<String> tags, @RequestParam(defaultValue = "0") int minimumRating, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size, @RequestParam(defaultValue = "createdAt") String sortBy, @RequestParam(defaultValue = "desc") String sortDirection){
        String username= userDetails!=null? userDetails.getUsername() : null;
        return ResponseEntity.ok(postService.getFilteredPosts(cuisines,categories,tags,minimumRating,page,size,sortBy,sortDirection,username));

    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PostResponse> createPost(@AuthenticationPrincipal UserDetails userDetails, @ModelAttribute PostRequest request){
        return ResponseEntity.ok(postService.createPost(request, userDetails.getUsername()));
    }

    @PostMapping("/like/{postId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PostResponse> likePost(@AuthenticationPrincipal UserDetails userDetails,@PathVariable Long postId){
        return ResponseEntity.ok(postService.likePost(userDetails.getUsername(), postId));
    }

    @PostMapping("/dislike/{postId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PostResponse> dislikePost(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long postId){
        return ResponseEntity.ok(postService.dislikePost(userDetails.getUsername(),postId));
    }

    @PostMapping("/save/{postId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PostResponse> savePost(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long postId){
        return ResponseEntity.ok(postService.savePost(userDetails.getUsername(), postId));
    }

    @PostMapping("/unsave/{postId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PostResponse> unsavePost(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long postId){
        return ResponseEntity.ok(postService.unsavePost(userDetails.getUsername(), postId));
    }
}
