package com.ssims.service;

import com.ssims.dto.SkillDto;
import com.ssims.exception.ResourceNotFoundException;
import com.ssims.model.Notification;
import com.ssims.model.Skill;
import com.ssims.model.User;
import com.ssims.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public SkillService(SkillRepository skillRepository,
                        UserService userService,
                        NotificationService notificationService) {
        this.skillRepository = skillRepository;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    public List<Skill> getSkillsByStudentId(Long studentId) {
        return skillRepository.findByStudentId(studentId);
    }

    @Transactional
    public Skill addSkill(Long studentId, SkillDto dto) {
        User student = userService.getUserById(studentId);
        Skill skill = new Skill(
                student,
                dto.getName().trim(),
                dto.getCategory() != null ? dto.getCategory() : Skill.Category.TECHNICAL,
                dto.getProficiency() != null ? dto.getProficiency() : Skill.Proficiency.INTERMEDIATE,
                dto.getYearsOfExperience() != null ? dto.getYearsOfExperience() : 1
        );
        return skillRepository.save(skill);
    }

    @Transactional
    public Skill updateSkill(Long skillId, Long studentId, SkillDto dto) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + skillId));

        if (!skill.getStudent().getId().equals(studentId)) {
            throw new SecurityException("Unauthorized to modify this skill");
        }

        if (dto.getName() != null) skill.setName(dto.getName().trim());
        if (dto.getCategory() != null) skill.setCategory(dto.getCategory());
        if (dto.getProficiency() != null) skill.setProficiency(dto.getProficiency());
        if (dto.getYearsOfExperience() != null) skill.setYearsOfExperience(dto.getYearsOfExperience());

        return skillRepository.save(skill);
    }

    @Transactional
    public void deleteSkill(Long skillId, Long studentId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + skillId));

        if (!skill.getStudent().getId().equals(studentId)) {
            throw new SecurityException("Unauthorized to delete this skill");
        }

        skillRepository.delete(skill);
    }

    @Transactional
    public Skill verifySkill(Long skillId, String coordinatorName) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + skillId));

        skill.setVerified(true);
        skill.setVerifiedBy(coordinatorName);
        skill.setVerifiedAt(LocalDateTime.now());
        Skill updated = skillRepository.save(skill);

        notificationService.createNotification(
                skill.getStudent(),
                "Skill Endorsed!",
                "Your skill '" + skill.getName() + "' has been verified by coordinator " + coordinatorName,
                Notification.Type.SKILL_VERIFIED,
                "/profile"
        );

        return updated;
    }
}

