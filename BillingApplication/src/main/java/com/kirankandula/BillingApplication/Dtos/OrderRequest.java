package com.kirankandula.BillingApplication.Dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    @NotBlank(message = "Customer Name is Required")
    private String customerName;
    @NotBlank(message = "Mobile Number is required")
    private String mobileNumber;
    @NotEmpty(message = "Cart items cannot be empty")
    @Valid
    private List<OrderItemRequest> cartItems;
    @NotNull(message = "Subtotal is required")
    @DecimalMin(value = "0.01", message = "Subtotal must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Subtotal format is invalid")
    private Double subtotal;
    @NotNull(message = "Tax is required")
    @DecimalMin(value = "0.01", message = "Tax must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Tax format is invalid")
    private Double tax;
    @NotNull(message = "Grand total is required")
    @DecimalMin(value = "0.01", message = "Grand total must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Grand total format is invalid")
    private Double grandTotal;
    @NotBlank(message = "Payment Method is required")
    private String paymentMethod;
}
