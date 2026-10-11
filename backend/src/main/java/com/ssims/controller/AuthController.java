package com.ssims.controller;

import com.ssims.dto.ApiResponse;
import com.ssims.dto.AuthRequest;
import com.ssims.dto.AuthResponse;
import com.ssims.dto.RegisterRequest;
import com.ssims.model.User;
import com.ssims.service.AuthService;
import com.ssims.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for student and coordinator login, registration and session profile")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    @Operation(summary = "Login user and retrieve JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new student or coordinator")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Account created successfully", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<User>> getCurrentUser() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}

