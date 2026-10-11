package com.ssims.service;

import com.ssims.model.Notification;
import com.ssims.model.User;
import com.ssims.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(User recipient, String title, String message, Notification.Type type, String link) {
        Notification notification = new Notification(recipient, title, message, type, link);
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndReadStatusFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setReadStatus(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> list = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        for (Notification n : list) {
            n.setReadStatus(true);
        }
        notificationRepository.saveAll(list);
    }
}

