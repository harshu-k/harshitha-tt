package com.ssims.service;

import com.ssims.dto.CertificationDto;
import com.ssims.exception.ResourceNotFoundException;
import com.ssims.model.Certification;
import com.ssims.model.Notification;
import com.ssims.model.User;
import com.ssims.repository.CertificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CertificationService {

    private final CertificationRepository certificationRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public CertificationService(CertificationRepository certificationRepository,
                                UserService userService,
                                NotificationService notificationService) {
        this.certificationRepository = certificationRepository;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    public List<Certification> getCertificationsByStudentId(Long studentId) {
        return certificationRepository.findByStudentId(studentId);
    }

    public List<Certification> getAllCertifications() {
        return certificationRepository.findAll();
    }

    @Transactional
    public Certification addCertification(Long studentId, CertificationDto dto) {
        User student = userService.getUserById(studentId);
        Certification cert = new Certification(
                student,
                dto.getTitle(),
                dto.getIssuingOrganization(),
                dto.getIssueDate(),
                dto.getCredentialId(),
                dto.getCredentialUrl()
        );
        cert.setExpiryDate(dto.getExpiryDate());
        cert.setCertificateFile(dto.getCertificateFile());
        return certificationRepository.save(cert);
    }

    @Transactional
    public Certification updateCertification(Long certId, Long studentId, CertificationDto dto) {
        Certification cert = certificationRepository.findById(certId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found: " + certId));

        if (!cert.getStudent().getId().equals(studentId)) {
            throw new SecurityException("Unauthorized to modify this certification");
        }

        cert.setTitle(dto.getTitle());
        cert.setIssuingOrganization(dto.getIssuingOrganization());
        cert.setIssueDate(dto.getIssueDate());
        cert.setExpiryDate(dto.getExpiryDate());
        cert.setCredentialId(dto.getCredentialId());
        cert.setCredentialUrl(dto.getCredentialUrl());
        if (dto.getCertificateFile() != null) {
            cert.setCertificateFile(dto.getCertificateFile());
        }
        cert.setVerificationStatus(Certification.Status.PENDING); // Reset to pending if updated

        return certificationRepository.save(cert);
    }

    @Transactional
    public void deleteCertification(Long certId, Long studentId) {
        Certification cert = certificationRepository.findById(certId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found: " + certId));

        if (!cert.getStudent().getId().equals(studentId)) {
            throw new SecurityException("Unauthorized to delete this certification");
        }

        certificationRepository.delete(cert);
    }

    @Transactional
    public Certification updateStatus(Long certId, Certification.Status status, String coordinatorName, String notes) {
        Certification cert = certificationRepository.findById(certId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found: " + certId));

        cert.setVerificationStatus(status);
        cert.setVerifiedBy(coordinatorName);
        cert.setVerificationNotes(notes);
        cert.setVerifiedAt(LocalDateTime.now());
        Certification saved = certificationRepository.save(cert);

        String message = status == Certification.Status.VERIFIED
                ? "Your certification '" + cert.getTitle() + "' has been approved & verified!"
                : "Your certification '" + cert.getTitle() + "' was reviewed with feedback: " + (notes != null ? notes : "Needs revision");

        notificationService.createNotification(
                cert.getStudent(),
                "Certification Review Update",
                message,
                Notification.Type.CERTIFICATION_STATUS,
                "/certifications"
        );

        return saved;
    }
}

