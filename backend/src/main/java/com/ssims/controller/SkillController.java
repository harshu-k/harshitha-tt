package com.ssims.controller;

import com.ssims.dto.ApiResponse;
import com.ssims.dto.SkillDto;
import com.ssims.model.Skill;
import com.ssims.model.User;
import com.ssims.service.SkillService;
import com.ssims.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@Tag(name = "Skills", description = "Endpoints for managing technical and soft skills, proficiency, and verification")
public class SkillController {

    private final SkillService skillService;
    private final UserService userService;

    public SkillController(SkillService skillService, UserService userService) {
        this.skillService = skillService;
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Get skills of current authenticated student")
    public ResponseEntity<ApiResponse<List<Skill>>> getMySkills() {
        User user = userService.getCurrentUser();
        List<Skill> skills = skillService.getSkillsByStudentId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(skills));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get skills of a specific student by ID")
    public ResponseEntity<ApiResponse<List<Skill>>> getSkillsByStudent(@PathVariable Long studentId) {
        List<Skill> skills = skillService.getSkillsByStudentId(studentId);
        return ResponseEntity.ok(ApiResponse.success(skills));
    }

    @PostMapping
    @Operation(summary = "Add a new skill to student profile")
    public ResponseEntity<ApiResponse<Skill>> addSkill(@Valid @RequestBody SkillDto dto) {
        User user = userService.getCurrentUser();
        Skill skill = skillService.addSkill(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Skill added successfully", skill));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing skill")
    public ResponseEntity<ApiResponse<Skill>> updateSkill(@PathVariable Long id, @Valid @RequestBody SkillDto dto) {
        User user = userService.getCurrentUser();
        Skill skill = skillService.updateSkill(id, user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Skill updated successfully", skill));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a skill")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable Long id) {
        User user = userService.getCurrentUser();
        skillService.deleteSkill(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Skill removed successfully", null));
    }

    @PatchMapping("/{id}/verify")
    @Operation(summary = "Verify and endorse a student's skill (Coordinator/Admin only)")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Skill>> verifySkill(@PathVariable Long id) {
        User user = userService.getCurrentUser();
        Skill skill = skillService.verifySkill(id, user.getFullName());
        return ResponseEntity.ok(ApiResponse.success("Skill verified and endorsed", skill));
    }
}

