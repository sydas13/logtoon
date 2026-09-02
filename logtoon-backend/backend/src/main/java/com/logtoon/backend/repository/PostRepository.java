package com.logtoon.backend.repository;

import com.logtoon.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post,Long>, JpaSpecificationExecutor<Post> {

    @Modifying
    @Query("""
            UPDATE Post p SET p.likesCount=p.likesCount+1 WHERE p.id=:postId""")
    int incrementLikes(@Param("postId") Long postId);

    @Modifying
    @Query("""
            UPDATE Post p SET p.likesCount=p.likesCount-1 WHERE p.id=:postId""")
    int decrementLikes(@Param("postId") Long postId);

    @Modifying
    @Query("""
            UPDATE Post p SET p.savesCount=p.savesCount+1 WHERE p.id=:postId""")
    int incrementSaves(@Param("postId") Long postId);

    @Modifying
    @Query("""
            UPDATE Post p SET p.savesCount=p.savesCount-1 WHERE p.id=:postId""")
    int decrementSaves(@Param("postId") Long postId);
}
