package com.logtoon.backend.controller;

import com.logtoon.backend.dto.AuthResponse;
import com.logtoon.backend.dto.LoginRequest;
import com.logtoon.backend.dto.UserResponse;
import com.logtoon.backend.service.AuthService;
import com.logtoon.backend.dto.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/logtoon/auth")
public class AuthController {

    private final AuthService authService;


    @Autowired
    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request){
        return ResponseEntity.ok(authService.login(request));
    }
}
