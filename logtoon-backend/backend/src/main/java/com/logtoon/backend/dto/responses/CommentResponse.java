package com.logtoon.backend.dto.responses;

import com.logtoon.backend.entity.Comment;
import lombok.Builder;

@Builder
public record CommentResponse(
        Long id,
        String username,
        String avatarFileName,
        String value,
        Long postId,
        Long parentId,
        String parentUserName,
        Long rootId,
        boolean isLiked,
        Long likesCount,
        boolean isDeleted
) {
    public static CommentResponse toCommentResponse(Comment comment, boolean isLiked){

        Long parentId=comment.getParentComment()==null?null:comment.getParentComment().getId();
        String parentUserName=comment.getParentComment()==null?null:comment.getParentComment().getUser().getUsername();
        Long rootId= comment.getRootComment()==null? comment.getId():comment.getRootComment().getId();

        return CommentResponse.builder().id(comment.getId()).username(comment.getUser().getUsername()).avatarFileName(comment.getUser().getProfile().getAvatarFileName()).value(comment.getValue()).postId(comment.getPost().getId()).parentId(parentId).parentUserName(parentUserName).rootId(rootId).isLiked(isLiked).likesCount(comment.getLikesCount()).isDeleted(comment.isDeleted()).build();
    }
}
