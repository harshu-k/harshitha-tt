package com.ssims.dto;

import com.ssims.model.Application;
import java.time.LocalDateTime;

public class ApplicationDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentDepartment;
    private String studentRollNumber;
    private Double studentCgpa;
    private Long internshipId;
    private String internshipTitle;
    private String companyName;
    private String companyLogo;
    private String coverLetter;
    private String resumeUrl;
    private Application.Status status;
    private String coordinatorFeedback;
    private LocalDateTime interviewSchedule;
    private LocalDateTime appliedDate;
    private LocalDateTime updatedAt;

    public ApplicationDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getStudentDepartment() {
        return studentDepartment;
    }

    public void setStudentDepartment(String studentDepartment) {
        this.studentDepartment = studentDepartment;
    }

    public String getStudentRollNumber() {
        return studentRollNumber;
    }

    public void setStudentRollNumber(String studentRollNumber) {
        this.studentRollNumber = studentRollNumber;
    }

    public Double getStudentCgpa() {
        return studentCgpa;
    }

    public void setStudentCgpa(Double studentCgpa) {
        this.studentCgpa = studentCgpa;
    }

    public Long getInternshipId() {
        return internshipId;
    }

    public void setInternshipId(Long internshipId) {
        this.internshipId = internshipId;
    }

    public String getInternshipTitle() {
        return internshipTitle;
    }

    public void setInternshipTitle(String internshipTitle) {
        this.internshipTitle = internshipTitle;
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

    public Application.Status getStatus() {
        return status;
    }

    public void setStatus(Application.Status status) {
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

