package com.logtoon.backend.service;

import com.logtoon.backend.dto.AuthResponse;
import com.logtoon.backend.dto.LoginRequest;
import com.logtoon.backend.dto.UserResponse;
import com.logtoon.backend.entity.Badge;
import com.logtoon.backend.entity.Role;
import com.logtoon.backend.entity.AppUser;
import com.logtoon.backend.entity.UserProfile;
import com.logtoon.backend.exception.AlreadyExistsException;
import com.logtoon.backend.repository.AppUserRepository;
import com.logtoon.backend.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final AppUserRepository appUserRepository;
    private final AuthenticationManager authenticationManager;
    private final  JwtService jwtService;

    @Value("${default.image.file}")
    private String DEFAULT_IMAGE_FILE;
    @Value("${default.image.hash}")
    private String DEFAULT_IMAGE_HASH;

    public UserResponse register(RegisterRequest request){
        if (appUserRepository.existsByEmail(request.email())){
            throw new AlreadyExistsException("Email already exists");
        }

        if (appUserRepository.existsByUsername(request.username())){
            throw new AlreadyExistsException("Username already exists");
        }

        if (request.password().length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters");
        }

        UserProfile profile=UserProfile.builder().avatarFileName(DEFAULT_IMAGE_FILE).avatarHash(DEFAULT_IMAGE_HASH).badge(Badge.ROOKIE).build();

        AppUser user=AppUser.builder().username(request.username()).email(request.email()).password(passwordEncoder.encode(request.password())).role(Role.USER).profile(profile).build();

        AppUser savedUser= appUserRepository.save(user);

        return UserResponse.toResponse(savedUser);

    }

    public AuthResponse login(LoginRequest request){
        Authentication authentication= authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.username(),request.password()));

        AppUser user= appUserRepository.findByUsername(request.username()).orElseThrow(()->new BadCredentialsException("User does not exist"));

        String token= jwtService.generateToken(request.username());

        return new AuthResponse(token,UserResponse.toResponse(user));
    }
}
