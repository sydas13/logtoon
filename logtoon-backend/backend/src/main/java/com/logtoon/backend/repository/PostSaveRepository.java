package com.logtoon.backend.repository;

import com.logtoon.backend.entity.PostSave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.Set;

public interface PostSaveRepository extends JpaRepository<PostSave,Long> {

    @Query("""
            SELECT COUNT(ps)>0 FROM PostSave ps WHERE ps.user.id=:userId AND ps.post.id=:postId""")
    boolean existsSave(@Param("userId") Long userId,@Param("postId") Long postId);

    @Modifying
    @Query("""
            DELETE FROM PostSave ps WHERE ps.user.id=:userId AND ps.post.id=:postId""")
    void deleteByUserIdAndPostId(@Param("userId")Long userId, @Param("postId") Long postId);

    @Query("""
            SELECT ps.post.id FROM PostSave ps WHERE ps.user.id=:userId AND ps.post.id IN :postIds""")
    Set<Long> findSavedPostIds(@Param("userId") Long userId, @Param("postIds")Collection<Long> postIds);
}
