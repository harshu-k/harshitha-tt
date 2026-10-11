package com.ssims.repository;

import com.ssims.model.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {
    List<Internship> findByStatus(Internship.Status status);
    
    @Query("SELECT i FROM Internship i WHERE i.status = :status AND " +
           "(LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.domain) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.requiredSkills) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Internship> searchInternships(@Param("status") Internship.Status status, @Param("keyword") String keyword);

    long countByStatus(Internship.Status status);
}

