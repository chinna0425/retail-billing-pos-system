package com.kirankandula.BillingApplication.repository;

import com.kirankandula.BillingApplication.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemEntityJpaRepo extends JpaRepository<OrderItemEntity,Long> {
}
