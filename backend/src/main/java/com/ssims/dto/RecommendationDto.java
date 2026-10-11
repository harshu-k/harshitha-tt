package com.ssims.dto;

import java.util.List;

public class RecommendationDto {
    private InternshipDto internship;
    private int matchPercentage;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String recommendationReason;

    public RecommendationDto() {}

    public RecommendationDto(InternshipDto internship, int matchPercentage, List<String> matchedSkills, List<String> missingSkills, String recommendationReason) {
        this.internship = internship;
        this.matchPercentage = matchPercentage;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
        this.recommendationReason = recommendationReason;
    }

    public InternshipDto getInternship() {
        return internship;
    }

    public void setInternship(InternshipDto internship) {
        this.internship = internship;
    }

    public int getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(int matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public String getRecommendationReason() {
        return recommendationReason;
    }

    public void setRecommendationReason(String recommendationReason) {
        this.recommendationReason = recommendationReason;
    }
}

