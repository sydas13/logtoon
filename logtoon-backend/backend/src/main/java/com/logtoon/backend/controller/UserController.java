package com.logtoon.backend.controller;

import com.logtoon.backend.dto.requests.PostRequest;
import com.logtoon.backend.dto.requests.ProfileUpdateRequest;
import com.logtoon.backend.dto.responses.PostResponse;
import com.logtoon.backend.dto.responses.ProfileResponse;
import com.logtoon.backend.dto.responses.UserResponse;
import com.logtoon.backend.service.PostService;
import com.logtoon.backend.service.UserService;
import lombok.RequiredArgsConstructor;
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

    @PostMapping("/create")
    public ResponseEntity<PostResponse> createPost(@AuthenticationPrincipal UserDetails userDetails, @ModelAttribute PostRequest request){
        return ResponseEntity.ok(postService.createPost(request, userDetails.getUsername()));
    }

    @GetMapping("/posts")
    public ResponseEntity<List<PostResponse>> getPosts(@AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(postService.getPosts(userDetails.getUsername()));
    }
}
