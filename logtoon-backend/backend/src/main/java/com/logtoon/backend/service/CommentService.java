package com.logtoon.backend.service;

import com.logtoon.backend.dto.requests.CommentRequest;
import com.logtoon.backend.dto.responses.CommentResponse;
import com.logtoon.backend.entity.AppUser;
import com.logtoon.backend.entity.Comment;
import com.logtoon.backend.entity.CommentLike;
import com.logtoon.backend.entity.Post;
import com.logtoon.backend.exception.ResourceNotFoundException;
import com.logtoon.backend.repository.AppUserRepository;
import com.logtoon.backend.repository.CommentLikeRepository;
import com.logtoon.backend.repository.CommentRepository;
import com.logtoon.backend.repository.PostRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import javax.swing.text.html.parser.Entity;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final AppUserRepository appUserRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;

    @PersistenceContext
    private EntityManager entityManager;

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
        Comment savedComment=commentRepository.save(comment);
        postRepository.incrementCommentCount(post.getId());
        return CommentResponse.toCommentResponse(savedComment, commentLikeRepository.existsLike(user.getId(), savedComment.getId()));
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

        return CommentResponse.toCommentResponse(comment, false);
    }

    @Transactional
    public List<CommentResponse> getComments(String username,Long postId){
        List<Comment> comments= commentRepository.findByPostId(postId);
        Set<Long> likedCommentIds;

        if (username!=null){
            AppUser user=appUserRepository.findByUsername(username).orElse(null);
            if (user!=null){
                Set<Long> commentIds=comments.stream().map(Comment::getId).collect(Collectors.toSet());
                likedCommentIds=commentLikeRepository.findLikedCommentIds(user.getId(), commentIds);
            }else {
                likedCommentIds=new HashSet<>();
            }
        }else{
            likedCommentIds=new HashSet<>();
        }

        return comments.stream().map(comment -> CommentResponse.toCommentResponse(comment,likedCommentIds.contains(comment.getId()))).toList();
    }

    @Transactional
    public List<CommentResponse> getSubComments(String username,Long postId, Long commentId) {
        Comment rootComment=commentRepository.findById(commentId).orElseThrow(()->new ResourceNotFoundException("Comment not found"));

        List<Comment> comments= commentRepository.findByPostIdAndRootId(postId, rootComment.getId());
        Set<Long> likedCommentIds;

        if (username!=null){
            AppUser user=appUserRepository.findByUsername(username).orElse(null);
            if (user!=null){
                Set<Long> commentIds=comments.stream().map(Comment::getId).collect(Collectors.toSet());
                likedCommentIds=commentLikeRepository.findLikedCommentIds(user.getId(), commentIds);
            }else {
                likedCommentIds=new HashSet<>();
            }
        }else{
            likedCommentIds=new HashSet<>();
        }


        return comments.stream().map(comment -> CommentResponse.toCommentResponse(comment,likedCommentIds.contains(comment.getId()))).toList();
    }

    @Transactional
    public CommentResponse likeComment(String username, Long commentId){
        AppUser user= appUserRepository.findByUsername(username).orElseThrow(()->new ResourceNotFoundException("User not found"));
        Comment comment=commentRepository.findById(commentId).orElseThrow(()->new ResourceNotFoundException("Comment not found"));

        if(commentLikeRepository.existsLike(user.getId(), comment.getId()))
            throw new RuntimeException("Comment is already liked by the user");

        CommentLike commentLike=CommentLike.builder().user(user).comment(comment).createdAt(LocalDateTime.now()).build();

        commentLikeRepository.save(commentLike);

        commentRepository.incrementLikeCount(comment.getId());

        entityManager.refresh(comment);

        return CommentResponse.toCommentResponse(comment,commentLikeRepository.existsLike(user.getId(), comment.getId()));
    }

    @Transactional
    public CommentResponse dislikeComment(String username, Long commentId){
        AppUser user= appUserRepository.findByUsername(username).orElseThrow(()->new ResourceNotFoundException("User not found"));
        Comment comment=commentRepository.findById(commentId).orElseThrow(()->new ResourceNotFoundException("Comment not found"));

        if(!commentLikeRepository.existsLike(user.getId(), comment.getId()))
            throw new RuntimeException("Comment is already not liked by the user");

        commentLikeRepository.deleteByUserIdAndCommentId(user.getId(), comment.getId());

        commentRepository.decrementLikeCount(comment.getId());

        entityManager.refresh(comment);

        return CommentResponse.toCommentResponse(comment,commentLikeRepository.existsLike(user.getId(), comment.getId()));
    }
}
