package com.ssims.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "internship_id"})
})
public class Application {

    public enum Status {
        APPLIED,
        UNDER_REVIEW,
        SHORTLISTED,
        INTERVIEW_SCHEDULED,
        OFFERED,
        ACCEPTED,
        REJECTED,
        COMPLETED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @Column(length = 2000)
    private String coverLetter;

    private String resumeUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.APPLIED;

    @Column(length = 1000)
    private String coordinatorFeedback;

    private LocalDateTime interviewSchedule;

    private LocalDateTime appliedDate = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Application() {
    }

    public Application(User student, Internship internship, String coverLetter, String resumeUrl) {
        this.student = student;
        this.internship = internship;
        this.coverLetter = coverLetter;
        this.resumeUrl = resumeUrl;
        this.status = Status.APPLIED;
        this.appliedDate = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
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

    public Internship getInternship() {
        return internship;
    }

    public void setInternship(Internship internship) {
        this.internship = internship;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getCoordinatorFeedback() {
        return coordinatorFeedback;
    }

    public void setCoordinatorFeedback(String coordinatorFeedback) {
        this.coordinatorFeedback = coordinatorFeedback;
    }

    public LocalDateTime getInterviewSchedule() {
        return interviewSchedule;
    }

    public void setInterviewSchedule(LocalDateTime interviewSchedule) {
        this.interviewSchedule = interviewSchedule;
    }

    public LocalDateTime getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(LocalDateTime appliedDate) {
        this.appliedDate = appliedDate;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

