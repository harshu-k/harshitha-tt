package com.ssims.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "internships")
public class Internship {

    public enum WorkplaceType {
        REMOTE,
        HYBRID,
        ONSITE
    }

    public enum Status {
        ACTIVE,
        CLOSED,
        DRAFT
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false)
    private String companyName;

    private String companyLogo;
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkplaceType workplaceType = WorkplaceType.REMOTE;

    private String domain;
    private String stipend;
    private String duration;

    @Column(length = 4000, nullable = false)
    private String description;

    @Column(length = 2000)
    private String requirements;

    @Column(nullable = false)
    private String requiredSkills; // Comma-separated (e.g. "React, JavaScript, Tailwind CSS, REST API")

    private Double minCgpa = 6.0;
    private String eligibleDepartments = "All Departments"; // or "Computer Science, Information Technology, AI & DS"
    private LocalDate applicationDeadline;
    private Integer openings = 5;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "posted_by_id")
    private User postedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Internship() {
    }

    public Internship(String title, String companyName, String location, WorkplaceType workplaceType,
                      String domain, String stipend, String duration, String description,
                      String requirements, String requiredSkills, Double minCgpa, LocalDate deadline,
                      Integer openings, User postedBy) {
        this.title = title;
        this.companyName = companyName;
        this.location = location;
        this.workplaceType = workplaceType;
        this.domain = domain;
        this.stipend = stipend;
        this.duration = duration;
        this.description = description;
        this.requirements = requirements;
        this.requiredSkills = requiredSkills;
        this.minCgpa = minCgpa;
        this.applicationDeadline = deadline;
        this.openings = openings;
        this.postedBy = postedBy;
        this.status = Status.ACTIVE;
        this.createdAt = LocalDateTime.now();
    }

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

    public WorkplaceType getWorkplaceType() {
        return workplaceType;
    }

    public void setWorkplaceType(WorkplaceType workplaceType) {
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

    public User getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(User postedBy) {
        this.postedBy = postedBy;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

