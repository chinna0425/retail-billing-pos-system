package com.kirankandula.BillingApplication.Dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemRequest {


    @NotBlank(message = "Item Name is required")
    private String name;
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Price format is invalid")
    private BigDecimal price;
    @NotBlank(message = "categoryId is required")
    private String categoryId;
    @NotBlank(message = "Description is required")
    @Size(min = 10,message = "Description is minimum 10 characters")
    private String description;
}
