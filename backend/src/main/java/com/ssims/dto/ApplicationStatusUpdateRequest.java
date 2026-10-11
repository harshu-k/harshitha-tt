package com.ssims.dto;

import com.ssims.model.Application;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class ApplicationStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private Application.Status status;

    private String coordinatorFeedback;
    private LocalDateTime interviewSchedule;

    public ApplicationStatusUpdateRequest() {}

    public Application.Status getStatus() {
        return status;
    }

    public void setStatus(Application.Status status) {
        this.status = status;
    }

    public String getCoordinatorFeedback() {
        return coordinatorFeedback;
    }

    public void setCoordinatorFeedback(String coordinatorFeedback) {
        this.coordinatorFeedback = coordinatorFeedback;
    }

    public LocalDateTime getInterviewSchedule() {
        return interviewSchedule;
    }

    public void setInterviewSchedule(LocalDateTime interviewSchedule) {
        this.interviewSchedule = interviewSchedule;
    }
}

