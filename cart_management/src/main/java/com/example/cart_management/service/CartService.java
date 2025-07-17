package com.example.cart_management.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.example.cart_management.dto.ProductResponse;
import com.example.cart_management.model.Cart;
import com.example.cart_management.model.CartItem;
import com.example.cart_management.repository.CartItemRepository;
import com.example.cart_management.repository.CartRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepo;
    private final RestTemplate restTemplate;


    public void addToCart(String userId, Long productId, int quantity, String name, double price) {
    ProductResponse product = restTemplate.getForObject(
        "http://product-management:8082/api/products/" + productId,
        ProductResponse.class
    );

    if (product == null || product.getQuantity() < quantity) {
        throw new RuntimeException("Insufficient product quantity available");
    }

    Cart cart = cartRepo.findByUserId(userId)
        .orElseGet(() -> cartRepo.save(new Cart(null, userId)));

    CartItem item = cartItemRepo.findByCartAndProductId(cart, productId)
        .orElse(null);

    if (item == null) {
        item = new CartItem(
            null,
            cart,
            name,
            productId,
            quantity,
            price
        );
    } else {
        item.setQuantity(item.getQuantity() + quantity);
    }

    cartItemRepo.save(item);
    }


    public List<CartItem> getCartItems(String userId) {
        // Find cart or create a new one if none exists
        Cart cart = cartRepo.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUserId(userId);
            return cartRepo.save(newCart);
        });

        // Fetch items belonging to the cart; returns empty list if none
        return cartItemRepo.findByCart(cart);
    }


    @Transactional
    public void clearCart(String userId) {
        Cart cart = cartRepo.findByUserId(userId).orElseThrow();
        cartItemRepo.deleteByCart(cart);
    }

    public void updateCartItemQuantity(String userId, Long productId, int newQuantity) {
        Cart cart = cartRepo.findByUserId(userId).orElseThrow();
        CartItem item = cartItemRepo.findByCartAndProductId(cart, productId)
                .orElseThrow(() -> new RuntimeException("Product not found in cart"));

        item.setQuantity(newQuantity);
        cartItemRepo.save(item);
    }

    public void removeItem(String userId, Long productId) {
        Cart cart = cartRepo.findByUserId(userId).orElseThrow();
        CartItem item = cartItemRepo.findByCartAndProductId(cart, productId)
                .orElseThrow(() -> new RuntimeException("Product not found in cart"));

        cartItemRepo.delete(item);
    }
}