package com.ssims.repository;

import com.ssims.model.Application;
import com.ssims.model.Internship;
import com.ssims.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(User student);
    List<Application> findByStudentId(Long studentId);
    List<Application> findByInternship(Internship internship);
    List<Application> findByInternshipId(Long internshipId);
    Optional<Application> findByStudentIdAndInternshipId(Long studentId, Long internshipId);
    boolean existsByStudentIdAndInternshipId(Long studentId, Long internshipId);
    List<Application> findByStatus(Application.Status status);
    long countByStatus(Application.Status status);
}

