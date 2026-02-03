package com.kirankandula.BillingApplication.repository;

import com.kirankandula.BillingApplication.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryJpaRepo extends JpaRepository<CategoryEntity,Long> {
    boolean existsByName(String name);

    Optional<CategoryEntity> findByCategoryId(String categoryId);
}
