package com.kirankandula.BillingApplication.Dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemRequest {
    @NotBlank(message = "Item id is required")
    private String itemId;
    @NotBlank(message = "Item Name required")
    private String name;
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Price format is invalid")
    private Double price;
    @NotNull(message = "Quantity is required")
    @Min(value = 1)
    private Integer quantity;
}
