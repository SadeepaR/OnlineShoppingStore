package com.example.order_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {
    private Long orderId;
    private String userId;
    private String userEmail;
    private String shippingAddress;
    private Double totalPrice;
    private List<OrderItemDTO> items;
}
