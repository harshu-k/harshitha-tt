package com.ssims.repository;

import com.ssims.model.Certification;
import com.ssims.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByStudent(User student);
    List<Certification> findByStudentId(Long studentId);
    List<Certification> findByVerificationStatus(Certification.Status status);
    long countByVerificationStatus(Certification.Status status);
}

