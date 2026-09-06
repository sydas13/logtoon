package com.logtoon.backend.repository;

import com.logtoon.backend.entity.Comment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment,Long> {

    @EntityGraph(attributePaths = {"user","user.profile","post","parentComment","parentComment.post","rootComment","rootComment.user"})
    @Query("""
            SELECT c FROM Comment c WHERE c.post.id=:postId AND c.rootComment IS NULL""")
    List<Comment> findByPostId(@Param("postId") Long postId);

    @EntityGraph(attributePaths = {"user","user.profile","post","parentComment","parentComment.post","rootComment","rootComment.user"})
    @Query("""
            SELECT c FROM Comment c WHERE c.post.id=:postId AND c.rootComment.id=:rootId""")
    List<Comment> findByPostIdAndRootId(@Param("postId") Long postId,@Param("rootId") Long rootId);

}
