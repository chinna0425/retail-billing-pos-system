package com.kirankandula.BillingApplication.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponse {
    private String itemId;
    private String name;
    private Double price;
    private Integer quantity;
}
