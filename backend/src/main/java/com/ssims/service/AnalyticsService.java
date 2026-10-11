package com.ssims.service;

import com.ssims.dto.AnalyticsDto;
import com.ssims.model.Application;
import com.ssims.model.Certification;
import com.ssims.model.Internship;
import com.ssims.model.Role;
import com.ssims.model.User;
import com.ssims.repository.ApplicationRepository;
import com.ssims.repository.CertificationRepository;
import com.ssims.repository.InternshipRepository;
import com.ssims.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final CertificationRepository certificationRepository;

    public AnalyticsService(UserRepository userRepository,
                            InternshipRepository internshipRepository,
                            ApplicationRepository applicationRepository,
                            CertificationRepository certificationRepository) {
        this.userRepository = userRepository;
        this.internshipRepository = internshipRepository;
        this.applicationRepository = applicationRepository;
        this.certificationRepository = certificationRepository;
    }

    public AnalyticsDto getDashboardAnalytics() {
        AnalyticsDto dto = new AnalyticsDto();

        long studentsCount = userRepository.countByRole(Role.ROLE_STUDENT);
        long totalInternships = internshipRepository.count();
        long activeInternships = internshipRepository.countByStatus(Internship.Status.ACTIVE);
        long totalApplications = applicationRepository.count();

        long acceptedCount = applicationRepository.countByStatus(Application.Status.ACCEPTED) +
                             applicationRepository.countByStatus(Application.Status.OFFERED);
        long pendingCount = applicationRepository.countByStatus(Application.Status.APPLIED) +
                            applicationRepository.countByStatus(Application.Status.UNDER_REVIEW);

        double placementRate = (studentsCount > 0)
                ? Math.round(((double) acceptedCount / studentsCount) * 1000.0) / 10.0
                : 0.0;

        long verifiedCerts = certificationRepository.countByVerificationStatus(Certification.Status.VERIFIED);
        long pendingCerts = certificationRepository.countByVerificationStatus(Certification.Status.PENDING);

        dto.setTotalStudents(studentsCount);
        dto.setTotalInternships(totalInternships);
        dto.setActiveInternships(activeInternships);
        dto.setTotalApplications(totalApplications);
        dto.setTotalSelected(acceptedCount);
        dto.setTotalPending(pendingCount);
        dto.setPlacementRatePercentage(placementRate);
        dto.setVerifiedCertifications(verifiedCerts);
        dto.setPendingCertifications(pendingCerts);

        // Application status breakdown
        Map<String, Long> statusMap = new HashMap<>();
        for (Application.Status status : Application.Status.values()) {
            long count = applicationRepository.countByStatus(status);
            if (count > 0) {
                statusMap.put(status.name(), count);
            }
        }
        dto.setApplicationStatusCounts(statusMap);

        // Domain breakdown & Top skills in demand
        Map<String, Long> domainMap = new HashMap<>();
        Map<String, Long> skillCountMap = new HashMap<>();
        List<Internship> internships = internshipRepository.findAll();

        for (Internship i : internships) {
            String domain = i.getDomain() != null ? i.getDomain() : "Software Engineering";
            domainMap.put(domain, domainMap.getOrDefault(domain, 0L) + 1);

            if (i.getRequiredSkills() != null) {
                String[] skills = i.getRequiredSkills().split(",");
                for (String s : skills) {
                    String clean = s.trim();
                    if (!clean.isEmpty()) {
                        skillCountMap.put(clean, skillCountMap.getOrDefault(clean, 0L) + 1);
                    }
                }
            }
        }
        dto.setDomainCounts(domainMap);

        // Top 8 skills in demand
        Map<String, Long> sortedSkills = skillCountMap.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(8)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
        dto.setTopSkillsInDemand(sortedSkills);

        // Student department distribution
        List<User> students = userRepository.findByRole(Role.ROLE_STUDENT);
        Map<String, Long> deptMap = students.stream()
                .collect(Collectors.groupingBy(
                        u -> (u.getDepartment() != null && !u.getDepartment().isEmpty()) ? u.getDepartment() : "General",
                        Collectors.counting()
                ));
        dto.setDepartmentStudentCounts(deptMap);

        return dto;
    }
}

