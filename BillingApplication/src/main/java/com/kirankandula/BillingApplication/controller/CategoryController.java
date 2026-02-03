package com.kirankandula.BillingApplication.controller;

import com.kirankandula.BillingApplication.Dtos.CategoryRequest;
import com.kirankandula.BillingApplication.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/admin/categories/add-category", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addCategory(@Valid @RequestPart("data") CategoryRequest request, @RequestPart(value = "image",required = true) MultipartFile image) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.addCategory(request, image));
    }

    @GetMapping("/categories/all-categories")
    public ResponseEntity<?> fetchCategories(){
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.fetchCategories());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/category/{categoryId}")
    public ResponseEntity<?> deleteCategory(@PathVariable("categoryId") String categoryId){
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }
}
