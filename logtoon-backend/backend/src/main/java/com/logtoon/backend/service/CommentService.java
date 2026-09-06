package com.logtoon.backend.service;

import com.logtoon.backend.dto.requests.CommentRequest;
import com.logtoon.backend.dto.responses.CommentResponse;
import com.logtoon.backend.entity.AppUser;
import com.logtoon.backend.entity.Comment;
import com.logtoon.backend.entity.Post;
import com.logtoon.backend.exception.ResourceNotFoundException;
import com.logtoon.backend.repository.AppUserRepository;
import com.logtoon.backend.repository.CommentRepository;
import com.logtoon.backend.repository.PostRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final AppUserRepository appUserRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    @Transactional
    public CommentResponse createComment(String username, CommentRequest request){
        AppUser user= appUserRepository.findByUsername(username).orElseThrow(()->new ResourceNotFoundException("User not found"));
        Post post= postRepository.findById(request.postId()).orElseThrow(()->new ResourceNotFoundException("Post not found"));

        Comment rootComment=null;
        Comment parentComment=null;

        if(request.parentId()!=null){
            parentComment=commentRepository.findById(request.parentId()).orElseThrow(()->new ResourceNotFoundException("Comment does not exist"));

            if(!parentComment.getPost().getId().equals(post.getId()))
                throw new RuntimeException("Invalid post for commenting");

            rootComment=parentComment.getRootComment()!=null?parentComment.getRootComment():parentComment;

        }

        Comment comment=Comment.builder().value(request.comment()).createdAt(LocalDateTime.now()).user(user).post(post).parentComment(parentComment).rootComment(rootComment).build();

        postRepository.incrementCommentCount(post.getId());

        return CommentResponse.toCommentResponse(commentRepository.save(comment));
    }

    @Transactional
    public CommentResponse deleteComment(String username,Long commentId){
        AppUser user= appUserRepository.findByUsername(username).orElseThrow(()->new ResourceNotFoundException("User not found"));
        Comment comment=commentRepository.findById(commentId).orElseThrow(()->new ResourceNotFoundException("Comment not found"));

        if(!user.getId().equals(comment.getUser().getId()))
            throw new RuntimeException("Comment does not belong to the user");

        Post post=comment.getPost();

        comment.setDeleted(true);
        comment.setValue("[deleted]");

        postRepository.decrementCommentCount(post.getId());

        return CommentResponse.toCommentResponse(comment);
    }

    @Transactional
    public List<CommentResponse> getComments(Long postId){
        List<Comment> comments= commentRepository.findByPostId(postId);

        return comments.stream().map(CommentResponse::toCommentResponse).toList();
    }

    @Transactional
    public List<CommentResponse> getSubComments(Long postId, Long commentId) {
        Comment rootComment=commentRepository.findById(commentId).orElseThrow(()->new ResourceNotFoundException("Comment not found"));

        List<Comment> comments= commentRepository.findByPostIdAndRootId(postId, rootComment.getId());

        return comments.stream().map(CommentResponse::toCommentResponse).toList();
    }
}
