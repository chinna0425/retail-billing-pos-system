package com.kirankandula.BillingApplication.entity;

import com.kirankandula.BillingApplication.Dtos.PaymentDetails;
import com.kirankandula.BillingApplication.Dtos.PaymentMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="orders")
@EntityListeners(AuditingEntityListener.class)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String orderId;
    private String customerName;
    private String mobileNumber;
    private Double  subtotal;
    private Double tax;
    private Double grandTotal;
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @OneToMany(cascade = CascadeType.ALL,orphanRemoval = true)
    @JoinColumn(name="order_id")
    private List<OrderItemEntity> items=new ArrayList<>();

    @Embedded
    private PaymentDetails paymentDetails;
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @PrePersist
    protected void onCreate(){
        this.orderId="ORD"+System.currentTimeMillis();
        this.createdAt=LocalDateTime.now();
    }
}
