package com.ssims.controller;

import com.ssims.dto.ApiResponse;
import com.ssims.dto.CertificationDto;
import com.ssims.model.Certification;
import com.ssims.model.User;
import com.ssims.service.CertificationService;
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
@RequestMapping("/api/certifications")
@Tag(name = "Certifications", description = "Endpoints for managing certifications and credentials verification")
public class CertificationController {

    private final CertificationService certificationService;
    private final UserService userService;

    public CertificationController(CertificationService certificationService, UserService userService) {
        this.certificationService = certificationService;
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Get certifications of currently logged-in student")
    public ResponseEntity<ApiResponse<List<Certification>>> getMyCertifications() {
        User user = userService.getCurrentUser();
        List<Certification> certs = certificationService.getCertificationsByStudentId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(certs));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all certifications across all students (Coordinator/Admin view)")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<Certification>>> getAllCertifications() {
        List<Certification> list = certificationService.getAllCertifications();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping
    @Operation(summary = "Add a new certification")
    public ResponseEntity<ApiResponse<Certification>> addCertification(@Valid @RequestBody CertificationDto dto) {
        User user = userService.getCurrentUser();
        Certification cert = certificationService.addCertification(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Certification added successfully", cert));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing certification")
    public ResponseEntity<ApiResponse<Certification>> updateCertification(@PathVariable Long id, @Valid @RequestBody CertificationDto dto) {
        User user = userService.getCurrentUser();
        Certification cert = certificationService.updateCertification(id, user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Certification updated successfully", cert));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a certification")
    public ResponseEntity<ApiResponse<Void>> deleteCertification(@PathVariable Long id) {
        User user = userService.getCurrentUser();
        certificationService.deleteCertification(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Certification removed successfully", null));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Approve or reject a certification (Coordinator/Admin only)")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Certification>> updateCertificationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        User user = userService.getCurrentUser();
        String statusStr = payload.getOrDefault("status", "VERIFIED");
        String notes = payload.get("notes");
        Certification.Status status = Certification.Status.valueOf(statusStr.toUpperCase());

        Certification cert = certificationService.updateStatus(id, status, user.getFullName(), notes);
        return ResponseEntity.ok(ApiResponse.success("Certification verification updated", cert));
    }
}

