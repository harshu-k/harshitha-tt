package com.ssims.controller;

import com.ssims.dto.AnalyticsDto;
import com.ssims.dto.ApiResponse;
import com.ssims.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Endpoints for placement analytics, department statistics, and skill demand metrics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get comprehensive placement and skill analytics data (Coordinator/Admin only)")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<AnalyticsDto>> getDashboardAnalytics() {
        AnalyticsDto analytics = analyticsService.getDashboardAnalytics();
        return ResponseEntity.ok(ApiResponse.success("Analytics retrieved", analytics));
    }
}

