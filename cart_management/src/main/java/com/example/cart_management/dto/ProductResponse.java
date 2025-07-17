package com.example.cart_management.dto;

import lombok.Data;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private Integer quantity;
    private double price;
}
