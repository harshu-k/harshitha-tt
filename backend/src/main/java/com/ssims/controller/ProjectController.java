package com.ssims.controller;

import com.ssims.dto.ApiResponse;
import com.ssims.dto.ProjectDto;
import com.ssims.model.Project;
import com.ssims.model.User;
import com.ssims.service.ProjectService;
import com.ssims.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@Tag(name = "Projects", description = "Endpoints for managing student academic & technical projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService;

    public ProjectController(ProjectService projectService, UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Get projects of currently logged-in student")
    public ResponseEntity<ApiResponse<List<Project>>> getMyProjects() {
        User user = userService.getCurrentUser();
        List<Project> list = projectService.getProjectsByStudentId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get projects of a specific student by ID")
    public ResponseEntity<ApiResponse<List<Project>>> getProjectsByStudent(@PathVariable Long studentId) {
        List<Project> list = projectService.getProjectsByStudentId(studentId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping
    @Operation(summary = "Add a new project to portfolio")
    public ResponseEntity<ApiResponse<Project>> addProject(@Valid @RequestBody ProjectDto dto) {
        User user = userService.getCurrentUser();
        Project project = projectService.addProject(user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Project added successfully", project));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing project")
    public ResponseEntity<ApiResponse<Project>> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectDto dto) {
        User user = userService.getCurrentUser();
        Project project = projectService.updateProject(id, user.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", project));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a project")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long id) {
        User user = userService.getCurrentUser();
        projectService.deleteProject(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }
}

