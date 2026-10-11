package com.ssims.repository;

import com.ssims.model.Skill;
import com.ssims.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByStudent(User student);
    List<Skill> findByStudentId(Long studentId);
    List<Skill> findByStudentIdAndCategory(Long studentId, Skill.Category category);
    long countByVerified(Boolean verified);
}

