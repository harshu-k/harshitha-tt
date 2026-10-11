package com.ssims.dto;

import com.ssims.model.Project;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class ProjectDto {
    private Long id;

    @NotBlank(message = "Project title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Tech stack is required")
    private String techStack;

    private String projectUrl;
    private String repoUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    private Project.ProjectStatus status = Project.ProjectStatus.COMPLETED;

    public ProjectDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTechStack() {
        return techStack;
    }

    public void setTechStack(String techStack) {
        this.techStack = techStack;
    }

    public String getProjectUrl() {
        return projectUrl;
    }

    public void setProjectUrl(String projectUrl) {
        this.projectUrl = projectUrl;
    }

    public String getRepoUrl() {
        return repoUrl;
    }

    public void setRepoUrl(String repoUrl) {
        this.repoUrl = repoUrl;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Project.ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(Project.ProjectStatus status) {
        this.status = status;
    }
}

