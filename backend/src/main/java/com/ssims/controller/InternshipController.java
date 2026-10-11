package com.ssims.controller;

import com.ssims.dto.ApiResponse;
import com.ssims.dto.InternshipDto;
import com.ssims.dto.RecommendationDto;
import com.ssims.model.User;
import com.ssims.service.InternshipService;
import com.ssims.service.RecommendationService;
import com.ssims.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internships")
@Tag(name = "Internships", description = "Endpoints for exploring, posting, and recommending internship opportunities")
public class InternshipController {

    private final InternshipService internshipService;
    private final RecommendationService recommendationService;
    private final UserService userService;

    public InternshipController(InternshipService internshipService,
                                RecommendationService recommendationService,
                                UserService userService) {
        this.internshipService = internshipService;
        this.recommendationService = recommendationService;
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Explore available active internships with optional keyword search")
    public ResponseEntity<ApiResponse<List<InternshipDto>>> getInternships(
            @RequestParam(required = false) String search) {
        Long currentUserId = null;
        try {
            User user = userService.getCurrentUser();
            currentUserId = user.getId();
        } catch (Exception ignored) {
            // Unauthenticated exploration is allowed
        }
        List<InternshipDto> list = internshipService.getAllInternships(search, currentUserId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/manage")
    @Operation(summary = "Get all internships including drafts and closed ones (Coordinator/Admin only)")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<InternshipDto>>> getInternshipsForManagement() {
        List<InternshipDto> list = internshipService.getAllInternshipsForManagement();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Get AI/Skill-based internship recommendations for authenticated student")
    public ResponseEntity<ApiResponse<List<RecommendationDto>>> getRecommendations() {
        User user = userService.getCurrentUser();
        List<RecommendationDto> recommendations = recommendationService.getRecommendationsForStudent(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Skill-based recommendations computed", recommendations));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get internship details by ID")
    public ResponseEntity<ApiResponse<InternshipDto>> getInternshipById(@PathVariable Long id) {
        Long currentUserId = null;
        try {
            User user = userService.getCurrentUser();
            currentUserId = user.getId();
        } catch (Exception ignored) {}
        InternshipDto dto = internshipService.getInternshipById(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @Operation(summary = "Post a new internship opportunity (Coordinator/Admin only)")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<InternshipDto>> createInternship(@Valid @RequestBody InternshipDto dto) {
        User user = userService.getCurrentUser();
        InternshipDto created = internshipService.createInternship(dto, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Internship opportunity published", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an internship opportunity (Coordinator/Admin only)")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<InternshipDto>> updateInternship(@PathVariable Long id, @Valid @RequestBody InternshipDto dto) {
        InternshipDto updated = internshipService.updateInternship(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Internship updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an internship opportunity (Coordinator/Admin only)")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteInternship(@PathVariable Long id) {
        internshipService.deleteInternship(id);
        return ResponseEntity.ok(ApiResponse.success("Internship deleted successfully", null));
    }
}

