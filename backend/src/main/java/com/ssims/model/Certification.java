package com.ssims.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "certifications")
public class Certification {

    public enum Status {
        PENDING,
        VERIFIED,
        REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false)
    private String issuingOrganization;

    private LocalDate issueDate;
    private LocalDate expiryDate;

    private String credentialId;
    private String credentialUrl;
    private String certificateFile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status verificationStatus = Status.PENDING;

    private String verificationNotes;
    private String verifiedBy;
    private LocalDateTime verifiedAt;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Certification() {
    }

    public Certification(User student, String title, String issuingOrganization, LocalDate issueDate, String credentialId, String credentialUrl) {
        this.student = student;
        this.title = title;
        this.issuingOrganization = issuingOrganization;
        this.issueDate = issueDate;
        this.credentialId = credentialId;
        this.credentialUrl = credentialUrl;
        this.verificationStatus = Status.PENDING;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIssuingOrganization() {
        return issuingOrganization;
    }

    public void setIssuingOrganization(String issuingOrganization) {
        this.issuingOrganization = issuingOrganization;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(String credentialId) {
        this.credentialId = credentialId;
    }

    public String getCredentialUrl() {
        return credentialUrl;
    }

    public void setCredentialUrl(String credentialUrl) {
        this.credentialUrl = credentialUrl;
    }

    public String getCertificateFile() {
        return certificateFile;
    }

    public void setCertificateFile(String certificateFile) {
        this.certificateFile = certificateFile;
    }

    public Status getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(Status verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getVerificationNotes() {
        return verificationNotes;
    }

    public void setVerificationNotes(String verificationNotes) {
        this.verificationNotes = verificationNotes;
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

