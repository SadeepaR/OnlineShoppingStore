package com.example.order_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.order_management.model.*;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrder(Order order);
}
