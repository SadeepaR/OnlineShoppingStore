package com.example.cart_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cart_management.model.Cart;
import com.example.cart_management.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCart(Cart cart);
    Optional<CartItem> findByCartAndProductId(Cart cart, Long productId);
    void deleteByCart(Cart cart);
}