package com.ssims.controller;

import com.ssims.dto.ApiResponse;
import com.ssims.dto.ApplicationDto;
import com.ssims.dto.ApplicationStatusUpdateRequest;
import com.ssims.model.User;
import com.ssims.service.ApplicationService;
import com.ssims.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Applications", description = "Endpoints for student internship applications and coordinator reviews")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserService userService;

    public ApplicationController(ApplicationService applicationService, UserService userService) {
        this.applicationService = applicationService;
        this.userService = userService;
    }

    @PostMapping
    @Operation(summary = "Submit application for an internship")
    public ResponseEntity<ApiResponse<ApplicationDto>> apply(@RequestBody Map<String, Object> payload) {
        User user = userService.getCurrentUser();
        Long internshipId = Long.valueOf(payload.get("internshipId").toString());
        String coverLetter = (String) payload.get("coverLetter");
        String resumeUrl = (String) payload.get("resumeUrl");

        ApplicationDto dto = applicationService.applyForInternship(user.getId(), internshipId, coverLetter, resumeUrl);
        return ResponseEntity.ok(ApiResponse.success("Application submitted successfully", dto));
    }

    @GetMapping("/my")
    @Operation(summary = "Get list of applications submitted by currently logged-in student")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getMyApplications() {
        User user = userService.getCurrentUser();
        List<ApplicationDto> list = applicationService.getApplicationsByStudent(user.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all applications across all internships (Coordinator/Admin view)")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getAllApplications() {
        List<ApplicationDto> list = applicationService.getAllApplications();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/internship/{internshipId}")
    @Operation(summary = "Get applications for a specific internship (Coordinator/Admin view)")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getApplicationsByInternship(@PathVariable Long internshipId) {
        List<ApplicationDto> list = applicationService.getApplicationsByInternship(internshipId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update applicant status (e.g. Under Review, Shortlisted, Interview, Accepted) with feedback")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ApplicationDto>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        ApplicationDto updated = applicationService.updateApplicationStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Application status updated", updated));
    }
}

