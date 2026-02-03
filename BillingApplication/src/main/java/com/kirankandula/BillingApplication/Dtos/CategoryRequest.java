package com.kirankandula.BillingApplication.Dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryRequest {
    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 50)
    private String name;
    @NotBlank(message = "Description is required")
    private String description;
}
