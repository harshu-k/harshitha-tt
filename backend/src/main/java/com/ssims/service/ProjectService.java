package com.ssims.service;

import com.ssims.dto.ProjectDto;
import com.ssims.exception.ResourceNotFoundException;
import com.ssims.model.Project;
import com.ssims.model.User;
import com.ssims.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserService userService;

    public ProjectService(ProjectRepository projectRepository, UserService userService) {
        this.projectRepository = projectRepository;
        this.userService = userService;
    }

    public List<Project> getProjectsByStudentId(Long studentId) {
        return projectRepository.findByStudentId(studentId);
    }

    @Transactional
    public Project addProject(Long studentId, ProjectDto dto) {
        User student = userService.getUserById(studentId);
        Project project = new Project(
                student,
                dto.getTitle(),
                dto.getDescription(),
                dto.getTechStack(),
                dto.getRepoUrl(),
                dto.getProjectUrl(),
                dto.getStatus() != null ? dto.getStatus() : Project.ProjectStatus.COMPLETED
        );
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        return projectRepository.save(project);
    }

    @Transactional
    public Project updateProject(Long projectId, Long studentId, ProjectDto dto) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        if (!project.getStudent().getId().equals(studentId)) {
            throw new SecurityException("Unauthorized to modify this project");
        }

        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setTechStack(dto.getTechStack());
        project.setProjectUrl(dto.getProjectUrl());
        project.setRepoUrl(dto.getRepoUrl());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        if (dto.getStatus() != null) {
            project.setStatus(dto.getStatus());
        }

        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(Long projectId, Long studentId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        if (!project.getStudent().getId().equals(studentId)) {
            throw new SecurityException("Unauthorized to delete this project");
        }

        projectRepository.delete(project);
    }
}

