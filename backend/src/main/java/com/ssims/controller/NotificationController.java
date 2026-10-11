package com.ssims.controller;

import com.ssims.dto.ApiResponse;
import com.ssims.model.Notification;
import com.ssims.model.User;
import com.ssims.service.NotificationService;
import com.ssims.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "Endpoints for in-app alert notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Get list of notifications for the current authenticated user")
    public ResponseEntity<ApiResponse<List<Notification>>> getMyNotifications() {
        User user = userService.getCurrentUser();
        List<Notification> list = notificationService.getNotificationsForUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notifications count for badge display")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        User user = userService.getCurrentUser();
        long count = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(ApiResponse.success(Map.of("unreadCount", count)));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }

    @PostMapping("/read-all")
    @Operation(summary = "Mark all notifications as read for current user")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        User user = userService.getCurrentUser();
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(ApiResponse.success("All marked as read", null));
    }
}

