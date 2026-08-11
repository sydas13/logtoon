package com.logtoon.backend.controller;

import com.logtoon.backend.dto.requests.AdjectivesFilterRequest;
import com.logtoon.backend.dto.responses.PostAdjectivesResponse;
import com.logtoon.backend.dto.responses.PostResponse;
import com.logtoon.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Page<PostResponse>> getFilteredPosts(@RequestParam List<String> cuisines,@RequestParam List<String> categories,@RequestParam List<String> tags, @RequestParam(defaultValue = "0") int minimumRating,@RequestParam(defaultValue = "0") int page,@RequestParam(defaultValue = "5") int size,@RequestParam(defaultValue = "createdAt") String sortBy,@RequestParam(defaultValue = "desc") String sortDirection){

        return ResponseEntity.ok(postService.getFilteredPosts(cuisines,categories,tags,minimumRating,page,size,sortBy,sortDirection));

    }
}
