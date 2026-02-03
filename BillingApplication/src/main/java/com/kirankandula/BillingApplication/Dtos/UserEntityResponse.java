package com.kirankandula.BillingApplication.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserEntityResponse {
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String UserId;
    private String email;
    private String role;
}
