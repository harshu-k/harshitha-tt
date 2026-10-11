package com.ssims.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    public enum Type {
        APPLICATION_UPDATE,
        NEW_INTERNSHIP,
        CERTIFICATION_STATUS,
        SKILL_VERIFIED,
        SYSTEM
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000, nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type = Type.SYSTEM;

    private Boolean readStatus = false;
    private String link;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Notification() {
    }

    public Notification(User recipient, String title, String message, Type type, String link) {
        this.recipient = recipient;
        this.title = title;
        this.message = message;
        this.type = type;
        this.link = link;
        this.readStatus = false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getRecipient() {
        return recipient;
    }

    public void setRecipient(User recipient) {
        this.recipient = recipient;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public Boolean getReadStatus() {
        return readStatus;
    }

    public void setReadStatus(Boolean readStatus) {
        this.readStatus = readStatus;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

