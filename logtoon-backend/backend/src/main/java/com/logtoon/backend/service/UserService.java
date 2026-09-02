package com.logtoon.backend.service;

import com.logtoon.backend.dto.requests.ProfileUpdateRequest;
import com.logtoon.backend.dto.responses.ProfileResponse;
import com.logtoon.backend.dto.responses.UserResponse;
import com.logtoon.backend.entity.AppUser;
import com.logtoon.backend.entity.UserProfile;
import com.logtoon.backend.exception.ImageStorageException;
import com.logtoon.backend.exception.ResourceNotFoundException;
import com.logtoon.backend.repository.AppUserRepository;
import com.logtoon.backend.repository.UserProfileRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    @Value("{image.upload.dir}")
    private String uploadDir;

    private final AppUserRepository appUserRepository;
    private final UserProfileRepository userProfileRepository;
    private final ImageService imageService;


    public UserResponse getUser(String username){
        AppUser user= appUserRepository.findByUsername(username).orElseThrow(()->new ResourceNotFoundException("User not availaible"));

        return UserResponse.toResponse(user);
    }

    public ProfileResponse getProfile(String username){
        UserProfile profile=appUserRepository.findByUsername(username).orElseThrow(()-> new ResourceNotFoundException("User not found")).getProfile();
        return ProfileResponse.toResponse(profile);
    }

    @Transactional
    public ProfileResponse updateProfile(String username, ProfileUpdateRequest request)  {
        String oldAvatarFile =null;
        String newAvatarFile =null;
        UserProfile profile= appUserRepository.findByUsername(username).orElseThrow(()-> new ResourceNotFoundException("User not found")).getProfile();
        if (request.name() != null)
            profile.setName(request.name());

        if (request.bio() != null)
            profile.setBio(request.bio());

        try {
            if (request.avatar() != null && !request.avatar().isEmpty()) {
                String newAvatarHash = imageService.generateImageHash(request.avatar());

                if (!newAvatarHash.equals(profile.getAvatarHash())) {
                    oldAvatarFile = profile.getAvatarFileName();
                    newAvatarFile = imageService.saveImage(request.avatar());
                    profile.setAvatarFileName(newAvatarFile);
                    profile.setAvatarHash(newAvatarHash);
                }
            }

            UserProfile savedProfile = userProfileRepository.save(profile);
            if (oldAvatarFile !=null)
                imageService.deleteImage(oldAvatarFile);
            return ProfileResponse.toResponse(savedProfile);
        }catch (ImageStorageException e){
            if(newAvatarFile !=null)
                imageService.deleteImage(newAvatarFile);

            throw e;
        }
    }

}

//cache, cascade