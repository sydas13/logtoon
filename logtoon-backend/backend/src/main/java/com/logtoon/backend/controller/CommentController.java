package com.logtoon.backend.controller;

import com.logtoon.backend.dto.requests.CommentRequest;
import com.logtoon.backend.dto.responses.CommentResponse;
import com.logtoon.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
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
    public ResponseEntity<List<CommentResponse>> getComments(@Nullable @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long postId){
        String username=userDetails==null?null: userDetails.getUsername();
        return ResponseEntity.ok(commentService.getComments(username,postId));
    }

    @GetMapping("/post/{postId}/comment/{commentId}")
    public ResponseEntity<List<CommentResponse>> getSubComments(@Nullable @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long postId, @PathVariable Long commentId){
        String username=userDetails==null?null: userDetails.getUsername();
        return ResponseEntity.ok(commentService.getSubComments(username,postId,commentId));
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

    @PostMapping("/like/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommentResponse> likeComment(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long commentId){
        return ResponseEntity.ok(commentService.likeComment(userDetails.getUsername(), commentId));
    }

    @PostMapping("/dislike/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommentResponse> dislikeComment(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long commentId){
        return ResponseEntity.ok(commentService.dislikeComment(userDetails.getUsername(), commentId));
    }
}
