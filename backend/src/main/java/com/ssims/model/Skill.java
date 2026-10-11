package com.ssims.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "skills")
public class Skill {

    public enum Category {
        TECHNICAL,
        SOFT_SKILL,
        FRAMEWORK_TOOL,
        DATABASE,
        CLOUD_DEVOPS
    }

    public enum Proficiency {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED,
        EXPERT
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category = Category.TECHNICAL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Proficiency proficiency = Proficiency.INTERMEDIATE;

    private Integer yearsOfExperience = 1;

    private Boolean verified = false;

    private String verifiedBy;

    private LocalDateTime verifiedAt;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Skill() {
    }

    public Skill(User student, String name, Category category, Proficiency proficiency, Integer yearsOfExperience) {
        this.student = student;
        this.name = name;
        this.category = category;
        this.proficiency = proficiency;
        this.yearsOfExperience = yearsOfExperience;
        this.verified = false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Proficiency getProficiency() {
        return proficiency;
    }

    public void setProficiency(Proficiency proficiency) {
        this.proficiency = proficiency;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public String getVerifiedBy() {
        return verifiedBy;
    }

    public void setVerifiedBy(String verifiedBy) {
        this.verifiedBy = verifiedBy;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

