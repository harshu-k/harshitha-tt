package com.ssims.controller;

import com.ssims.dto.ApiResponse;
import com.ssims.dto.StudentProfileDto;
import com.ssims.model.User;
import com.ssims.service.StudentProfileService;
import com.ssims.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
@Tag(name = "Student Profile", description = "Endpoints for managing student academic profile and resume")
public class StudentProfileController {

    private final StudentProfileService profileService;
    private final UserService userService;

    public StudentProfileController(StudentProfileService profileService, UserService userService) {
        this.profileService = profileService;
        this.userService = userService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get currently logged-in student profile with skills, certifications, and projects")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getMyProfile() {
        User user = userService.getCurrentUser();
        StudentProfileDto profile = profileService.getFullProfile(user.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update student profile details")
    public ResponseEntity<ApiResponse<StudentProfileDto>> updateProfile(@RequestBody StudentProfileDto dto) {
        User user = userService.getCurrentUser();
        StudentProfileDto updated = profileService.updateProfile(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/profile/{userId}")
    @Operation(summary = "Get full profile of a specific student by user ID")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getStudentProfileById(@PathVariable Long userId) {
        StudentProfileDto profile = profileService.getFullProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all student profiles (for Coordinator/Admin view)")
    public ResponseEntity<ApiResponse<List<StudentProfileDto>>> getAllStudents() {
        List<User> students = userService.getStudents();
        List<StudentProfileDto> list = students.stream()
                .map(s -> profileService.getFullProfile(s.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/resume")
    @Operation(summary = "Get structured ATS resume payload for current student")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getResumeData() {
        User user = userService.getCurrentUser();
        StudentProfileDto profile = profileService.getFullProfile(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Resume data retrieved", profile));
    }
}

