package com.kirankandula.BillingApplication.repository;

import com.kirankandula.BillingApplication.entity.ItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemJpaRepo extends JpaRepository<ItemEntity,Long> {
    boolean existsByName(String name);

    Optional<ItemEntity> findByItemId(String itemId);

    Integer countByCategoryEntity_CategoryId(String categoryId);
}
