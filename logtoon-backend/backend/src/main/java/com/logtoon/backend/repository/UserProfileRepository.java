package com.logtoon.backend.repository;

import com.logtoon.backend.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile,Long> {

}
