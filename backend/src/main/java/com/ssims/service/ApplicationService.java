package com.ssims.service;

import com.ssims.dto.ApplicationDto;
import com.ssims.dto.ApplicationStatusUpdateRequest;
import com.ssims.exception.BadRequestException;
import com.ssims.exception.ResourceNotFoundException;
import com.ssims.model.Application;
import com.ssims.model.Internship;
import com.ssims.model.Notification;
import com.ssims.model.StudentProfile;
import com.ssims.model.User;
import com.ssims.repository.ApplicationRepository;
import com.ssims.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final InternshipService internshipService;
    private final UserService userService;
    private final StudentProfileRepository profileRepository;
    private final NotificationService notificationService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              InternshipService internshipService,
                              UserService userService,
                              StudentProfileRepository profileRepository,
                              NotificationService notificationService) {
        this.applicationRepository = applicationRepository;
        this.internshipService = internshipService;
        this.userService = userService;
        this.profileRepository = profileRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public ApplicationDto applyForInternship(Long studentId, Long internshipId, String coverLetter, String resumeUrl) {
        if (applicationRepository.existsByStudentIdAndInternshipId(studentId, internshipId)) {
            throw new BadRequestException("You have already applied for this internship opportunity.");
        }

        User student = userService.getUserById(studentId);
        Internship internship = internshipService.getInternshipEntity(internshipId);

        if (internship.getStatus() != Internship.Status.ACTIVE) {
            throw new BadRequestException("This internship is no longer accepting applications.");
        }

        // If resumeUrl not provided in request, check if student profile has uploaded resume
        if (resumeUrl == null || resumeUrl.trim().isEmpty()) {
            StudentProfile profile = profileRepository.findByUserId(studentId).orElse(null);
            if (profile != null && profile.getResumeUrl() != null) {
                resumeUrl = profile.getResumeUrl();
            }
        }

        Application application = new Application(student, internship, coverLetter, resumeUrl);
        Application saved = applicationRepository.save(application);

        // Send confirmation notification to student
        notificationService.createNotification(
                student,
                "Application Submitted Successfully!",
                "Your application for " + internship.getTitle() + " at " + internship.getCompanyName() + " has been received.",
                Notification.Type.APPLICATION_UPDATE,
                "/applications"
        );

        // Notify internship poster / coordinator if available
        if (internship.getPostedBy() != null) {
            notificationService.createNotification(
                    internship.getPostedBy(),
                    "New Application Received",
                    student.getFullName() + " applied for " + internship.getTitle(),
                    Notification.Type.APPLICATION_UPDATE,
                    "/coordinator/applications"
            );
        }

        return mapToDto(saved);
    }

    public List<ApplicationDto> getApplicationsByStudent(Long studentId) {
        return applicationRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getApplicationsByInternship(Long internshipId) {
        return applicationRepository.findByInternshipId(internshipId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationDto updateApplicationStatus(Long applicationId, ApplicationStatusUpdateRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));

        application.setStatus(request.getStatus());
        if (request.getCoordinatorFeedback() != null) {
            application.setCoordinatorFeedback(request.getCoordinatorFeedback());
        }
        if (request.getInterviewSchedule() != null) {
            application.setInterviewSchedule(request.getInterviewSchedule());
        }
        application.setUpdatedAt(LocalDateTime.now());

        Application updated = applicationRepository.save(application);

        // Notify student about the status update
        String statusText = request.getStatus().name().replace('_', ' ');
        String message = "Your application status for " + application.getInternship().getTitle() + " has been updated to: " + statusText;
        if (request.getCoordinatorFeedback() != null && !request.getCoordinatorFeedback().trim().isEmpty()) {
            message += ". Feedback: " + request.getCoordinatorFeedback();
        }

        notificationService.createNotification(
                application.getStudent(),
                "Application Status Update: " + statusText,
                message,
                Notification.Type.APPLICATION_UPDATE,
                "/applications"
        );

        return mapToDto(updated);
    }

    public ApplicationDto mapToDto(Application app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());
        dto.setStudentId(app.getStudent().getId());
        dto.setStudentName(app.getStudent().getFullName());
        dto.setStudentEmail(app.getStudent().getEmail());
        dto.setStudentDepartment(app.getStudent().getDepartment());

        // Fetch roll number & cgpa if student profile exists
        profileRepository.findByUserId(app.getStudent().getId()).ifPresent(profile -> {
            dto.setStudentRollNumber(profile.getRollNumber());
            dto.setStudentCgpa(profile.getCgpa());
        });

        dto.setInternshipId(app.getInternship().getId());
        dto.setInternshipTitle(app.getInternship().getTitle());
        dto.setCompanyName(app.getInternship().getCompanyName());
        dto.setCompanyLogo(app.getInternship().getCompanyLogo());
        dto.setCoverLetter(app.getCoverLetter());
        dto.setResumeUrl(app.getResumeUrl());
        dto.setStatus(app.getStatus());
        dto.setCoordinatorFeedback(app.getCoordinatorFeedback());
        dto.setInterviewSchedule(app.getInterviewSchedule());
        dto.setAppliedDate(app.getAppliedDate());
        dto.setUpdatedAt(app.getUpdatedAt());

        return dto;
    }
}

