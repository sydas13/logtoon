package com.logtoon.backend.repository;

import com.logtoon.backend.entity.AppUser;
import com.logtoon.backend.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;

public interface PostLikeRepository extends JpaRepository<PostLike,Long> {

    @Query("""
            SELECT pl.post.id FROM PostLike pl WHERE pl.user.id=:userId AND pl.post.id IN :postIds""")
    Set<Long> findLikedPostIds(@Param("userId") Long userId,@Param("postIds") Collection<Long> postIds);

    @Query("""
            SELECT COUNT(pl)>0 FROM PostLike pl WHERE pl.user.id = :userId AND pl.post.id = :postId""")
    boolean existsLike(@Param("userId") Long userId,@Param("postId") Long postId);

    @Modifying
    @Query("""
            DELETE FROM PostLike pl WHERE pl.user.id = :userId AND pl.post.id = :postId""")
    void deleteByUserIdAndPostId(@Param("userId") Long userId,@Param("postId") Long postId);
}
