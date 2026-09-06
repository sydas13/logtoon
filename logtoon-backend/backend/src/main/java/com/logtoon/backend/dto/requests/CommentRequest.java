package com.logtoon.backend.dto.requests;

public record CommentRequest(
        String comment,
        Long postId,
        Long parentId
) {
}
