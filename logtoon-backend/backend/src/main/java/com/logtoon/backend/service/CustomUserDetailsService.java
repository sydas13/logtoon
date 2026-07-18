package com.logtoon.backend.service;

import com.logtoon.backend.entity.CustomUserDetails;
import com.logtoon.backend.entity.AppUser;
import com.logtoon.backend.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    @Autowired
    public CustomUserDetailsService(AppUserRepository appUserRepository){
        this.appUserRepository=appUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user= appUserRepository.findByUsername(username).orElseThrow(()-> new UsernameNotFoundException("User not found"));

        return new CustomUserDetails(user);
    }
}
