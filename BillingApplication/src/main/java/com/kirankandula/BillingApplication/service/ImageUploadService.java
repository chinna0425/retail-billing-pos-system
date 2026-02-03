package com.kirankandula.BillingApplication.service;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageUploadService {

    private final Cloudinary cloudinary;

    private static final long MAX_SIZE = 5 * 1024 * 1024;

    public Map<String, String> uploadImage(MultipartFile file) {

        validateFile(file);

        try {

            File tempFile = File.createTempFile("upload-", file.getOriginalFilename());
            file.transferTo(tempFile);

            long start = System.currentTimeMillis();

            Map uploadResult = cloudinary.uploader().upload(
                    tempFile,
                    Map.of(
                            "folder", "billing/categories",
                            "resource_type", "image"
                    )
            );

            System.out.println("Cloudinary upload took {} ms"+ (System.currentTimeMillis() - start));

            tempFile.delete();

            return Map.of(
                    "url", uploadResult.get("secure_url").toString(),
                    "publicId", uploadResult.get("public_id").toString()
            );

        } catch (IOException e) {
            throw new RuntimeException("Image upload failed", e);
        }
    }

    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        if (file.getSize() > MAX_SIZE) {
            throw new IllegalArgumentException("Image size must be under 5MB");
        }

        String contentType = file.getContentType();

        if (!List.of("image/jpeg", "image/png").contains(contentType)) {
            throw new IllegalArgumentException("Only JPG and PNG images allowed");
        }
    }

    @Async
    public void deleteImage(String publicId) {

        try {
            cloudinary.uploader()
                    .destroy(publicId, Map.of());

        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image", e);
        }
    }
}
