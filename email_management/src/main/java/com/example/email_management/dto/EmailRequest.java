package com.example.email_management.dto;

import lombok.Data;
import java.util.List;

@Data
public class EmailRequest {
    private String to;
    private String subject;
    private Integer orderId;
    private String userEmail;
    private String shippingAddress;
    private double totalPrice;
    private List<ProductItem> items;
}
