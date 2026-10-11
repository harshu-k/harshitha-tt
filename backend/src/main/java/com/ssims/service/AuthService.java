package com.ssims.service;

import com.ssims.config.JwtTokenProvider;
import com.ssims.dto.AuthRequest;
import com.ssims.dto.AuthResponse;
import com.ssims.dto.RegisterRequest;
import com.ssims.exception.BadRequestException;
import com.ssims.model.Role;
import com.ssims.model.StudentProfile;
import com.ssims.model.User;
import com.ssims.repository.StudentProfileRepository;
import com.ssims.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final NotificationService notificationService;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       StudentProfileRepository studentProfileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       NotificationService notificationService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.notificationService = notificationService;
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole(), user.getDepartment(), user.getAvatarUrl());
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        Role role = request.getRole() != null ? request.getRole() : Role.ROLE_STUDENT;

        User user = new User(
                request.getFullName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role,
                request.getDepartment(),
                request.getPhone()
        );
        user = userRepository.save(user);

        // If registering as a student, initialize their profile
        if (role == Role.ROLE_STUDENT) {
            String roll = request.getRollNumber() != null ? request.getRollNumber() : "STU-" + System.currentTimeMillis() % 100000;
            String course = request.getCourse() != null ? request.getCourse() : "B.Tech Computer Science";
            Integer gradYear = request.getGraduationYear() != null ? request.getGraduationYear() : 2026;
            Double cgpa = request.getCgpa() != null ? request.getCgpa() : 8.0;

            StudentProfile profile = new StudentProfile(user, roll, course, request.getDepartment(), gradYear, cgpa);
            studentProfileRepository.save(profile);
        }

        String token = tokenProvider.generateTokenFromUsername(user.getEmail());

        notificationService.createNotification(
                user,
                "Welcome to SSIMS!",
                "Your account has been successfully created. Complete your skills and profile to discover internships.",
                com.ssims.model.Notification.Type.SYSTEM,
                "/profile"
        );

        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole(), user.getDepartment(), user.getAvatarUrl());
    }
}

