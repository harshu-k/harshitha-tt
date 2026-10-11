package com.ssims.dto;

import java.util.Map;

public class AnalyticsDto {
    private long totalStudents;
    private long totalInternships;
    private long activeInternships;
    private long totalApplications;
    private long totalSelected;
    private long totalPending;
    private double placementRatePercentage;
    private long verifiedCertifications;
    private long pendingCertifications;

    private Map<String, Long> applicationStatusCounts;
    private Map<String, Long> domainCounts;
    private Map<String, Long> topSkillsInDemand;
    private Map<String, Long> departmentStudentCounts;

    public AnalyticsDto() {}

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalInternships() {
        return totalInternships;
    }

    public void setTotalInternships(long totalInternships) {
        this.totalInternships = totalInternships;
    }

    public long getActiveInternships() {
        return activeInternships;
    }

    public void setActiveInternships(long activeInternships) {
        this.activeInternships = activeInternships;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getTotalSelected() {
        return totalSelected;
    }

    public void setTotalSelected(long totalSelected) {
        this.totalSelected = totalSelected;
    }

    public long getTotalPending() {
        return totalPending;
    }

    public void setTotalPending(long totalPending) {
        this.totalPending = totalPending;
    }

    public double getPlacementRatePercentage() {
        return placementRatePercentage;
    }

    public void setPlacementRatePercentage(double placementRatePercentage) {
        this.placementRatePercentage = placementRatePercentage;
    }

    public long getVerifiedCertifications() {
        return verifiedCertifications;
    }

    public void setVerifiedCertifications(long verifiedCertifications) {
        this.verifiedCertifications = verifiedCertifications;
    }

    public long getPendingCertifications() {
        return pendingCertifications;
    }

    public void setPendingCertifications(long pendingCertifications) {
        this.pendingCertifications = pendingCertifications;
    }

    public Map<String, Long> getApplicationStatusCounts() {
        return applicationStatusCounts;
    }

    public void setApplicationStatusCounts(Map<String, Long> applicationStatusCounts) {
        this.applicationStatusCounts = applicationStatusCounts;
    }

    public Map<String, Long> getDomainCounts() {
        return domainCounts;
    }

    public void setDomainCounts(Map<String, Long> domainCounts) {
        this.domainCounts = domainCounts;
    }

    public Map<String, Long> getTopSkillsInDemand() {
        return topSkillsInDemand;
    }

    public void setTopSkillsInDemand(Map<String, Long> topSkillsInDemand) {
        this.topSkillsInDemand = topSkillsInDemand;
    }

    public Map<String, Long> getDepartmentStudentCounts() {
        return departmentStudentCounts;
    }

    public void setDepartmentStudentCounts(Map<String, Long> departmentStudentCounts) {
        this.departmentStudentCounts = departmentStudentCounts;
    }
}

