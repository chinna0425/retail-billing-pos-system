package com.kirankandula.BillingApplication.service;

import com.kirankandula.BillingApplication.Dtos.ItemRequest;
import com.kirankandula.BillingApplication.Dtos.ItemResponse;
import com.kirankandula.BillingApplication.entity.CategoryEntity;
import com.kirankandula.BillingApplication.entity.ItemEntity;
import com.kirankandula.BillingApplication.exceptions.CategoryAlreadyExistsException;
import com.kirankandula.BillingApplication.exceptions.ItemAlreadyExistsException;
import com.kirankandula.BillingApplication.exceptions.ResourceNotFoundException;
import com.kirankandula.BillingApplication.repository.CategoryJpaRepo;
import com.kirankandula.BillingApplication.repository.ItemJpaRepo;
import org.apache.commons.text.WordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class ItemService {

    @Autowired
    private ImageUploadService imageUploadService;

    @Autowired
    private ItemJpaRepo itemJpaRepo;

    @Autowired
    private CategoryJpaRepo categoryJpaRepo;

    public ItemResponse addItem(ItemRequest request, MultipartFile image){
        String name= WordUtils.capitalizeFully(request.getName().trim());
        if (itemJpaRepo.existsByName(name)) {
            throw new ItemAlreadyExistsException(
                    "Item with name '" + name + "' already exists");
        }
        CategoryEntity categoryEntity=categoryJpaRepo.findByCategoryId(request.getCategoryId())
                .orElseThrow(()->new ResourceNotFoundException("Category not found with "+request.getCategoryId()));
        Map<String, String> uploadData = imageUploadService.uploadImage(image);
        ItemEntity itemEntity=new ItemEntity();
        itemEntity.setItemId(UUID.randomUUID().toString());
        itemEntity.setName(name);
        itemEntity.setDescription(request.getDescription());
        itemEntity.setPrice(request.getPrice());
        itemEntity.setImgUrl(uploadData.get("url"));
        itemEntity.setImgPublicId(uploadData.get("publicId"));
        itemEntity.setCategoryEntity(categoryEntity);
        ItemEntity newItem=itemJpaRepo.save(itemEntity);
        return convertToResponse(newItem);
    }

    public List<ItemResponse> getAllItems(){
        return itemJpaRepo.findAll().stream().map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public void deleteItem(String itemId){
        ItemEntity existingItem=itemJpaRepo.findByItemId(itemId).orElseThrow(()-> new ResourceNotFoundException("Item not found with id "+itemId));
        itemJpaRepo.delete(existingItem);
        CompletableFuture.runAsync(() -> {
            if (existingItem.getImgPublicId() != null) {
                imageUploadService.deleteImage(existingItem.getImgPublicId());
            }
        });
    }

    private ItemResponse convertToResponse(ItemEntity newItem) {
        ItemResponse response=new ItemResponse();
        response.setItemId(newItem.getItemId());
        response.setName(newItem.getName());
        response.setPrice(newItem.getPrice());
        response.setCategoryId(newItem.getCategoryEntity().getCategoryId());
        response.setDescription(newItem.getDescription());
        response.setCategoryName(newItem.getCategoryEntity().getName());
        response.setImgUrl(newItem.getImgUrl());
        response.setCreatedAt(newItem.getCreatedAt());
        response.setUpdatedAt(newItem.getUpdatedAt());
        return response;
    }
}
