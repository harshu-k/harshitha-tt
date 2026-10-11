package com.ssims.repository;

import com.ssims.model.Notification;
import com.ssims.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
    long countByRecipientIdAndReadStatusFalse(Long recipientId);
}

