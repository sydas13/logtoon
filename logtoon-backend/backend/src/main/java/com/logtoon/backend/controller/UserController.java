package com.logtoon.backend.controller;

import com.logtoon.backend.dto.requests.PostRequest;
import com.logtoon.backend.dto.requests.ProfileUpdateRequest;
import com.logtoon.backend.dto.responses.PostResponse;
import com.logtoon.backend.dto.responses.ProfileResponse;
import com.logtoon.backend.dto.responses.UserResponse;
import com.logtoon.backend.service.PostService;
import com.logtoon.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/logtoon/user")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserController {

    private final UserService userService;
    private final PostService postService;

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(@AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(userService.getProfile(userDetails.getUsername()));
    }

    @PatchMapping(path = "/profile",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfileResponse> updateProfile(@AuthenticationPrincipal UserDetails userDetails, @ModelAttribute ProfileUpdateRequest request){
        return ResponseEntity.ok(userService.updateProfile(userDetails.getUsername(),request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getUser(@AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(userService.getUser(userDetails.getUsername()));
    }

    @GetMapping("/posts")
    public ResponseEntity<Page<PostResponse>> getFilteredPosts(@AuthenticationPrincipal UserDetails userDetails, @RequestParam List<String> cuisines, @RequestParam List<String> categories, @RequestParam List<String> tags, @RequestParam(defaultValue = "0") int minimumRating, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size, @RequestParam(defaultValue = "createdAt") String sortBy, @RequestParam(defaultValue = "desc") String sortDirection){
        return ResponseEntity.ok(postService.getFilteredPostsByUsername(userDetails.getUsername(),cuisines,categories,tags,minimumRating,page,size,sortBy,sortDirection));
    }
}
