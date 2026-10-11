package com.ssims.controller;

import com.ssims.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@Tag(name = "File Uploads", description = "Endpoints for uploading student resumes, certificates, and attachments")
public class FileUploadController {

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @PostMapping("/upload")
    @Operation(summary = "Upload a file (e.g. PDF resume, image, certificate)")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Cannot upload empty file"));
        }

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.pdf");
        String fileExtension = "";
        int dotIndex = originalFileName.lastIndexOf(".");
        if (dotIndex >= 0) {
            fileExtension = originalFileName.substring(dotIndex);
        }

        String storedFileName = UUID.randomUUID().toString() + fileExtension;
        Path targetLocation = uploadPath.resolve(storedFileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        String fileDownloadUri = "/uploads/" + storedFileName;

        Map<String, String> response = new HashMap<>();
        response.put("originalName", originalFileName);
        response.put("fileName", storedFileName);
        response.put("fileUrl", fileDownloadUri);
        response.put("size", String.valueOf(file.getSize()));

        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", response));
    }
}

