package com.ssims.dto;

import com.ssims.model.Internship;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class InternshipDto {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String companyLogo;
    private String location;
    private Internship.WorkplaceType workplaceType = Internship.WorkplaceType.REMOTE;
    private String domain;
    private String stipend;
    private String duration;

    @NotBlank(message = "Description is required")
    private String description;

    private String requirements;

    @NotBlank(message = "Required skills are required")
    private String requiredSkills;

    private Double minCgpa = 6.0;
    private String eligibleDepartments;
    private LocalDate applicationDeadline;
    private Integer openings = 5;
    private Internship.Status status = Internship.Status.ACTIVE;
    private Long postedById;
    private String postedByName;
    private long applicantCount;
    private boolean userApplied;

    public InternshipDto() {}

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

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyLogo() {
        return companyLogo;
    }

    public void setCompanyLogo(String companyLogo) {
        this.companyLogo = companyLogo;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Internship.WorkplaceType getWorkplaceType() {
        return workplaceType;
    }

    public void setWorkplaceType(Internship.WorkplaceType workplaceType) {
        this.workplaceType = workplaceType;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getStipend() {
        return stipend;
    }

    public void setStipend(String stipend) {
        this.stipend = stipend;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public String getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public Double getMinCgpa() {
        return minCgpa;
    }

    public void setMinCgpa(Double minCgpa) {
        this.minCgpa = minCgpa;
    }

    public String getEligibleDepartments() {
        return eligibleDepartments;
    }

    public void setEligibleDepartments(String eligibleDepartments) {
        this.eligibleDepartments = eligibleDepartments;
    }

    public LocalDate getApplicationDeadline() {
        return applicationDeadline;
    }

    public void setApplicationDeadline(LocalDate applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }

    public Integer getOpenings() {
        return openings;
    }

    public void setOpenings(Integer openings) {
        this.openings = openings;
    }

    public Internship.Status getStatus() {
        return status;
    }

    public void setStatus(Internship.Status status) {
        this.status = status;
    }

    public Long getPostedById() {
        return postedById;
    }

    public void setPostedById(Long postedById) {
        this.postedById = postedById;
    }

    public String getPostedByName() {
        return postedByName;
    }

    public void setPostedByName(String postedByName) {
        this.postedByName = postedByName;
    }

    public long getApplicantCount() {
        return applicantCount;
    }

    public void setApplicantCount(long applicantCount) {
        this.applicantCount = applicantCount;
    }

    public boolean isUserApplied() {
        return userApplied;
    }

    public void setUserApplied(boolean userApplied) {
        this.userApplied = userApplied;
    }
}

