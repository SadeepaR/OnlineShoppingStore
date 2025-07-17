package com.example.cart_management.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cart_management.model.CartItem;
import com.example.cart_management.service.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@RequestParam String userId,
                                            @RequestParam Long productId,
                                            @RequestParam String name,
                                            @RequestParam double price,
                                            @RequestParam int quantity) {
        cartService.addToCart(userId, productId, quantity, name, price);
        return ResponseEntity.ok("Added to cart");
    }

    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable String userId) {
        return cartService.getCartItems(userId);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateQuantity(@RequestParam String userId,
                                                 @RequestParam Long productId,
                                                 @RequestParam int quantity) {
        cartService.updateCartItemQuantity(userId, productId, quantity);
        return ResponseEntity.ok("Quantity updated");
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeItem(@RequestParam String userId,
                                             @RequestParam Long productId) {
        cartService.removeItem(userId, productId);
        return ResponseEntity.ok("Item removed");
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<String> clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared");
    }
}