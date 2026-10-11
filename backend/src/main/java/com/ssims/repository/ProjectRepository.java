package com.ssims.repository;

import com.ssims.model.Project;
import com.ssims.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStudent(User student);
    List<Project> findByStudentId(Long studentId);
}

