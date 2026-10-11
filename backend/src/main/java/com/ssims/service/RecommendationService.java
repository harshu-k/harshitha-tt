package com.ssims.service;

import com.ssims.dto.InternshipDto;
import com.ssims.dto.RecommendationDto;
import com.ssims.model.Internship;
import com.ssims.model.Skill;
import com.ssims.model.StudentProfile;
import com.ssims.repository.InternshipRepository;
import com.ssims.repository.SkillRepository;
import com.ssims.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final InternshipRepository internshipRepository;
    private final SkillRepository skillRepository;
    private final StudentProfileRepository profileRepository;
    private final InternshipService internshipService;

    public RecommendationService(InternshipRepository internshipRepository,
                                 SkillRepository skillRepository,
                                 StudentProfileRepository profileRepository,
                                 InternshipService internshipService) {
        this.internshipRepository = internshipRepository;
        this.skillRepository = skillRepository;
        this.profileRepository = profileRepository;
        this.internshipService = internshipService;
    }

    public List<RecommendationDto> getRecommendationsForStudent(Long studentId) {
        List<Skill> studentSkills = skillRepository.findByStudentId(studentId);
        Set<String> studentSkillNames = studentSkills.stream()
                .map(s -> s.getName().trim().toLowerCase())
                .collect(Collectors.toSet());

        StudentProfile profile = profileRepository.findByUserId(studentId).orElse(null);
        Double studentCgpa = (profile != null && profile.getCgpa() != null) ? profile.getCgpa() : 7.0;

        List<Internship> activeInternships = internshipRepository.findByStatus(Internship.Status.ACTIVE);
        List<RecommendationDto> recommendations = new ArrayList<>();

        for (Internship internship : activeInternships) {
            String rawRequired = internship.getRequiredSkills();
            List<String> requiredSkillsList = Arrays.stream(rawRequired.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());

            List<String> matched = new ArrayList<>();
            List<String> missing = new ArrayList<>();

            for (String req : requiredSkillsList) {
                String reqLower = req.toLowerCase();
                boolean isMatch = studentSkillNames.stream()
                        .anyMatch(s -> s.contains(reqLower) || reqLower.contains(s));

                if (isMatch) {
                    matched.add(req);
                } else {
                    missing.add(req);
                }
            }

            int matchPercent = 0;
            if (!requiredSkillsList.isEmpty()) {
                matchPercent = (int) Math.round(((double) matched.size() / requiredSkillsList.size()) * 100);
            }

            // Bonus if CGPA is above requirement
            if (internship.getMinCgpa() != null && studentCgpa >= internship.getMinCgpa() && matchPercent > 0) {
                matchPercent = Math.min(100, matchPercent + 5);
            }

            String reason;
            if (matchPercent >= 80) {
                reason = "Exceptional fit! You match " + matched.size() + " out of " + requiredSkillsList.size() + " core skills.";
            } else if (matchPercent >= 50) {
                reason = "Strong candidate! You have high proficiency in " + String.join(", ", matched);
            } else {
                reason = "Good opportunity to learn: requires " + String.join(", ", missing);
            }

            InternshipDto dto = internshipService.mapToDto(internship, studentId);
            recommendations.add(new RecommendationDto(dto, matchPercent, matched, missing, reason));
        }

        // Sort by match percentage descending
        recommendations.sort((a, b) -> Integer.compare(b.getMatchPercentage(), a.getMatchPercentage()));
        return recommendations;
    }
}

