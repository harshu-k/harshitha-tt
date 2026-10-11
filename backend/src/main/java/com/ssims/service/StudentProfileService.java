package com.ssims.service;

import com.ssims.dto.StudentProfileDto;
import com.ssims.exception.ResourceNotFoundException;
import com.ssims.model.StudentProfile;
import com.ssims.model.User;
import com.ssims.repository.CertificationRepository;
import com.ssims.repository.ProjectRepository;
import com.ssims.repository.SkillRepository;
import com.ssims.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class StudentProfileService {

    private final StudentProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final CertificationRepository certificationRepository;
    private final ProjectRepository projectRepository;
    private final UserService userService;

    public StudentProfileService(StudentProfileRepository profileRepository,
                                 SkillRepository skillRepository,
                                 CertificationRepository certificationRepository,
                                 ProjectRepository projectRepository,
                                 UserService userService) {
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
        this.certificationRepository = certificationRepository;
        this.projectRepository = projectRepository;
        this.userService = userService;
    }

    public StudentProfile getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userService.getUserById(userId);
                    StudentProfile newProfile = new StudentProfile(
                            user,
                            "STU-" + user.getId(),
                            "B.Tech Computer Science",
                            user.getDepartment() != null ? user.getDepartment() : "Computer Science",
                            2026,
                            8.5
                    );
                    return profileRepository.save(newProfile);
                });
    }

    public StudentProfileDto getFullProfile(Long userId) {
        StudentProfile profile = getProfileByUserId(userId);
        User user = profile.getUser();

        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setRollNumber(profile.getRollNumber());
        dto.setCourse(profile.getCourse());
        dto.setDepartment(profile.getDepartment());
        dto.setGraduationYear(profile.getGraduationYear());
        dto.setCgpa(profile.getCgpa());
        dto.setGithubUrl(profile.getGithubUrl());
        dto.setLinkedinUrl(profile.getLinkedinUrl());
        dto.setPortfolioUrl(profile.getPortfolioUrl());
        dto.setResumeUrl(profile.getResumeUrl());
        dto.setResumeFileName(profile.getResumeFileName());
        dto.setCareerObjective(profile.getCareerObjective());

        dto.setSkills(skillRepository.findByStudentId(userId));
        dto.setCertifications(certificationRepository.findByStudentId(userId));
        dto.setProjects(projectRepository.findByStudentId(userId));

        return dto;
    }

    @Transactional
    public StudentProfileDto updateProfile(Long userId, StudentProfileDto dto) {
        StudentProfile profile = getProfileByUserId(userId);
        User user = profile.getUser();

        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getAvatarUrl() != null) user.setAvatarUrl(dto.getAvatarUrl());

        if (dto.getRollNumber() != null) profile.setRollNumber(dto.getRollNumber());
        if (dto.getCourse() != null) profile.setCourse(dto.getCourse());
        if (dto.getDepartment() != null) profile.setDepartment(dto.getDepartment());
        if (dto.getGraduationYear() != null) profile.setGraduationYear(dto.getGraduationYear());
        if (dto.getCgpa() != null) profile.setCgpa(dto.getCgpa());
        if (dto.getGithubUrl() != null) profile.setGithubUrl(dto.getGithubUrl());
        if (dto.getLinkedinUrl() != null) profile.setLinkedinUrl(dto.getLinkedinUrl());
        if (dto.getPortfolioUrl() != null) profile.setPortfolioUrl(dto.getPortfolioUrl());
        if (dto.getResumeUrl() != null) profile.setResumeUrl(dto.getResumeUrl());
        if (dto.getResumeFileName() != null) profile.setResumeFileName(dto.getResumeFileName());
        if (dto.getCareerObjective() != null) profile.setCareerObjective(dto.getCareerObjective());
        profile.setUpdatedAt(LocalDateTime.now());

        profileRepository.save(profile);
        return getFullProfile(userId);
    }
}

