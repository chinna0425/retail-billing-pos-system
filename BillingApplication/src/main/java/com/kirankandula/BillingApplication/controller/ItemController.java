package com.kirankandula.BillingApplication.controller;

import com.kirankandula.BillingApplication.Dtos.ItemRequest;
import com.kirankandula.BillingApplication.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class ItemController {

    @Autowired
    private ItemService itemService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/admin/items/add-item", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addItem(@Valid @RequestPart("data") ItemRequest request, @RequestPart(value = "image",required = true) MultipartFile image) {
        return ResponseEntity.status(HttpStatus.CREATED).body(itemService.addItem(request, image));
    }

    @GetMapping("/items/all-items")
    public ResponseEntity<?> getAllItems(){
        return ResponseEntity.status(HttpStatus.OK).body(itemService.getAllItems());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/item/{itemId}")
    public ResponseEntity<?> deleteItem(@PathVariable String itemId){
        itemService.deleteItem(itemId);
        return ResponseEntity.noContent().build();
    }

}
