package com.logtoon.backend.controller;

import com.logtoon.backend.dto.requests.CommentRequest;
import com.logtoon.backend.dto.responses.CommentResponse;
import com.logtoon.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/logtoon/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long postId){
        return ResponseEntity.ok(commentService.getComments(postId));
    }

    @GetMapping("/post/{postId}/comment/{commentId}")
    public ResponseEntity<List<CommentResponse>> getSubComments(@PathVariable Long postId, @PathVariable Long commentId){
        return ResponseEntity.ok(commentService.getSubComments(postId,commentId));
    }

    @PostMapping("/delete/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommentResponse> deleteComment(@AuthenticationPrincipal UserDetails userDetails, @RequestParam Long commentId){
        return ResponseEntity.ok(commentService.deleteComment(userDetails.getUsername(), commentId));
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommentResponse> createComment(@AuthenticationPrincipal UserDetails userDetails, @RequestBody CommentRequest request){
        return ResponseEntity.ok(commentService.createComment(userDetails.getUsername(), request));
    }

}
