package com.example.email_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductItem {
    private Integer productId;
    private String productName;
    private Integer quantity;
    private double pricePerUnit; 
}