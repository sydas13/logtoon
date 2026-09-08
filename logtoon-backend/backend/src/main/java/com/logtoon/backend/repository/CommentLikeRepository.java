package com.logtoon.backend.repository;

import com.logtoon.backend.entity.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.Set;

public interface CommentLikeRepository extends JpaRepository<CommentLike,Long> {

    @Query("""
            SELECT COUNT(cl)>0 FROM CommentLike cl WHERE cl.user.id=:userId AND cl.comment.id=:commentId""")
    boolean existsLike(@Param("userId") Long userId,@Param("commentId") Long commentId);

    @Query("""
            SELECT cl.comment.id FROM CommentLike cl WHERE cl.user.id=:userId AND cl.comment.id IN :commentIds""")
    Set<Long> findLikedCommentIds(Long userId, Collection<Long> commentIds);

    @Modifying
    @Query("""
            DELETE FROM CommentLike cl WHERE cl.user.id=:userId AND cl.comment.id=:commentId""")
    void deleteByUserIdAndCommentId(@Param("userId") Long userId,@Param("commentId") Long commentId);
}
