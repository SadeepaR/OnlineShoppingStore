package com.example.order_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.order_management.model.Order;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUserId(String userId);
}
