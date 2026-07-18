package com.logtoon.backend.controller;

import com.logtoon.backend.dto.ProfileUpdateRequest;
import com.logtoon.backend.dto.ProfileResponse;
import com.logtoon.backend.dto.UserResponse;
import com.logtoon.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("api/logtoon/user")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserController {

    private final UserService userService;


    @GetMapping("/profile/{id}")
    public ResponseEntity<ProfileResponse> getProfileById(@PathVariable Long id){
        return ResponseEntity.ok(userService.getProfileById(id));
    }

    @PatchMapping(path = "/profile",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfileResponse> updateProfileById(@AuthenticationPrincipal UserDetails userDetails, @ModelAttribute ProfileUpdateRequest request){
        return ResponseEntity.ok(userService.updateProfile(userDetails.getUsername(),request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getUser(@AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(userService.getUser(userDetails.getUsername()));
    }
}
