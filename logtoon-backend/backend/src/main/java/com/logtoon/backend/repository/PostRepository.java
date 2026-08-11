package com.logtoon.backend.repository;

import com.logtoon.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PostRepository extends JpaRepository<Post,Long>, JpaSpecificationExecutor<Post> {
}
