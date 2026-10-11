package com.ssims.service;

import com.ssims.dto.InternshipDto;
import com.ssims.exception.ResourceNotFoundException;
import com.ssims.model.Internship;
import com.ssims.model.User;
import com.ssims.repository.ApplicationRepository;
import com.ssims.repository.InternshipRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InternshipService {

    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final UserService userService;

    public InternshipService(InternshipRepository internshipRepository,
                             ApplicationRepository applicationRepository,
                             UserService userService) {
        this.internshipRepository = internshipRepository;
        this.applicationRepository = applicationRepository;
        this.userService = userService;
    }

    public List<InternshipDto> getAllInternships(String keyword, Long currentUserId) {
        List<Internship> list;
        if (keyword != null && !keyword.trim().isEmpty()) {
            list = internshipRepository.searchInternships(Internship.Status.ACTIVE, keyword.trim());
        } else {
            list = internshipRepository.findByStatus(Internship.Status.ACTIVE);
        }

        return list.stream()
                .map(i -> mapToDto(i, currentUserId))
                .collect(Collectors.toList());
    }

    public List<InternshipDto> getAllInternshipsForManagement() {
        return internshipRepository.findAll().stream()
                .map(i -> mapToDto(i, null))
                .collect(Collectors.toList());
    }

    public InternshipDto getInternshipById(Long id, Long currentUserId) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship opportunity not found with id: " + id));
        return mapToDto(internship, currentUserId);
    }

    public Internship getInternshipEntity(Long id) {
        return internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship opportunity not found with id: " + id));
    }

    @Transactional
    public InternshipDto createInternship(InternshipDto dto, Long postedById) {
        User postedBy = userService.getUserById(postedById);
        Internship internship = new Internship(
                dto.getTitle(),
                dto.getCompanyName(),
                dto.getLocation(),
                dto.getWorkplaceType() != null ? dto.getWorkplaceType() : Internship.WorkplaceType.REMOTE,
                dto.getDomain(),
                dto.getStipend(),
                dto.getDuration(),
                dto.getDescription(),
                dto.getRequirements(),
                dto.getRequiredSkills(),
                dto.getMinCgpa() != null ? dto.getMinCgpa() : 6.0,
                dto.getApplicationDeadline(),
                dto.getOpenings() != null ? dto.getOpenings() : 5,
                postedBy
        );
        internship.setCompanyLogo(dto.getCompanyLogo());
        internship.setEligibleDepartments(dto.getEligibleDepartments() != null ? dto.getEligibleDepartments() : "All Departments");
        internship.setStatus(dto.getStatus() != null ? dto.getStatus() : Internship.Status.ACTIVE);

        Internship saved = internshipRepository.save(internship);
        return mapToDto(saved, null);
    }

    @Transactional
    public InternshipDto updateInternship(Long id, InternshipDto dto) {
        Internship internship = getInternshipEntity(id);

        internship.setTitle(dto.getTitle());
        internship.setCompanyName(dto.getCompanyName());
        if (dto.getCompanyLogo() != null) internship.setCompanyLogo(dto.getCompanyLogo());
        internship.setLocation(dto.getLocation());
        if (dto.getWorkplaceType() != null) internship.setWorkplaceType(dto.getWorkplaceType());
        internship.setDomain(dto.getDomain());
        internship.setStipend(dto.getStipend());
        internship.setDuration(dto.getDuration());
        internship.setDescription(dto.getDescription());
        internship.setRequirements(dto.getRequirements());
        internship.setRequiredSkills(dto.getRequiredSkills());
        if (dto.getMinCgpa() != null) internship.setMinCgpa(dto.getMinCgpa());
        if (dto.getEligibleDepartments() != null) internship.setEligibleDepartments(dto.getEligibleDepartments());
        internship.setApplicationDeadline(dto.getApplicationDeadline());
        if (dto.getOpenings() != null) internship.setOpenings(dto.getOpenings());
        if (dto.getStatus() != null) internship.setStatus(dto.getStatus());

        Internship saved = internshipRepository.save(internship);
        return mapToDto(saved, null);
    }

    @Transactional
    public void deleteInternship(Long id) {
        Internship internship = getInternshipEntity(id);
        internshipRepository.delete(internship);
    }

    public InternshipDto mapToDto(Internship internship, Long currentUserId) {
        InternshipDto dto = new InternshipDto();
        dto.setId(internship.getId());
        dto.setTitle(internship.getTitle());
        dto.setCompanyName(internship.getCompanyName());
        dto.setCompanyLogo(internship.getCompanyLogo());
        dto.setLocation(internship.getLocation());
        dto.setWorkplaceType(internship.getWorkplaceType());
        dto.setDomain(internship.getDomain());
        dto.setStipend(internship.getStipend());
        dto.setDuration(internship.getDuration());
        dto.setDescription(internship.getDescription());
        dto.setRequirements(internship.getRequirements());
        dto.setRequiredSkills(internship.getRequiredSkills());
        dto.setMinCgpa(internship.getMinCgpa());
        dto.setEligibleDepartments(internship.getEligibleDepartments());
        dto.setApplicationDeadline(internship.getApplicationDeadline());
        dto.setOpenings(internship.getOpenings());
        dto.setStatus(internship.getStatus());

        if (internship.getPostedBy() != null) {
            dto.setPostedById(internship.getPostedBy().getId());
            dto.setPostedByName(internship.getPostedBy().getFullName());
        }

        long applicantCount = applicationRepository.findByInternshipId(internship.getId()).size();
        dto.setApplicantCount(applicantCount);

        if (currentUserId != null) {
            boolean applied = applicationRepository.existsByStudentIdAndInternshipId(currentUserId, internship.getId());
            dto.setUserApplied(applied);
        }

        return dto;
    }
}

