package com.example.order_management.dto;

import java.util.List;

import com.example.order_management.model.OrderItem;

import lombok.Data;

@Data
public class OrderRequest {
    private String userId;
    private String userEmail;
    private String shippingAddress;
    private List<OrderItem> items;
}
