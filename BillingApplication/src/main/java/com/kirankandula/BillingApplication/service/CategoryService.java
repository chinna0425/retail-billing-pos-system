package com.kirankandula.BillingApplication.service;

import com.kirankandula.BillingApplication.entity.CategoryEntity;
import com.kirankandula.BillingApplication.exceptions.CategoryAlreadyExistsException;
import com.kirankandula.BillingApplication.exceptions.ResourceNotFoundException;
import com.kirankandula.BillingApplication.Dtos.CategoryRequest;
import com.kirankandula.BillingApplication.Dtos.CategoryResponse;
import com.kirankandula.BillingApplication.repository.CategoryJpaRepo;
import com.kirankandula.BillingApplication.repository.ItemJpaRepo;
import org.apache.commons.text.WordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    @Autowired
    private CategoryJpaRepo categoryJpaRepo;

    @Autowired
    private ImageUploadService imageUploadService;

    @Autowired
    private ItemJpaRepo itemJpaRepo;

    public CategoryResponse addCategory(CategoryRequest request, MultipartFile image) {
        String name=WordUtils.capitalizeFully(request.getName().trim());
        if (categoryJpaRepo.existsByName(name)) {
            throw new CategoryAlreadyExistsException(
                    "Category with name '" + name + "' already exists");
        }
        Map<String, String> uploadData = imageUploadService.uploadImage(image);
        CategoryEntity newCategory=new CategoryEntity();
        newCategory.setName(name);
        newCategory.setDescription(request.getDescription());
        newCategory.setCategoryId(UUID.randomUUID().toString());
        newCategory.setImgUrl(uploadData.get("url"));
        newCategory.setImgPublicId(uploadData.get("publicId"));
        newCategory=categoryJpaRepo.save(newCategory);
        return convertToResponse(newCategory);
    }

    private CategoryResponse convertToResponse(CategoryEntity newCategory) {

        Integer count=itemJpaRepo.countByCategoryEntity_CategoryId(newCategory.getCategoryId());

        CategoryResponse response=new CategoryResponse();
        response.setCategoryId(newCategory.getCategoryId());
        response.setName(newCategory.getName());
        response.setDescription(newCategory.getDescription());
        response.setCreatedAt(newCategory.getCreatedAt());
        response.setImgUrl(newCategory.getImgUrl());
        response.setUpdatedAt(newCategory.getUpdatedAt());
        response.setItemsCount(count);
        return response;
    }

    public List<CategoryResponse> fetchCategories() {
        return categoryJpaRepo.findAll().stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void deleteCategory(String categoryId) {

        CategoryEntity categoryEntity = categoryJpaRepo.findByCategoryId(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("CategoryId : "+ categoryId));

        categoryJpaRepo.delete(categoryEntity);

        // run Cloudinary delete async
        CompletableFuture.runAsync(() -> {
            if (categoryEntity.getImgPublicId() != null) {
                imageUploadService.deleteImage(categoryEntity.getImgPublicId());
            }
        });
    }

}
