package com.example.order_management.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map; // Needed for the email request body
import java.util.stream.Collectors;     // Needed for the email request body

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service; // To capture response from API call
import org.springframework.web.client.RestTemplate;   // To check HTTP status codes

import com.example.order_management.dto.OrderItemDTO;
import com.example.order_management.dto.OrderRequest;
import com.example.order_management.dto.OrderResponseDTO;
import com.example.order_management.dto.ProductResponse;
import com.example.order_management.model.Order;
import com.example.order_management.model.OrderItem;
import com.example.order_management.repository.OrderItemRepository;
import com.example.order_management.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final RestTemplate restTemplate;

    // Base URL for the email-management service's API
    // This assumes email-management service is accessible via this URL within your deployment environment (e.g., Docker network)
    private final String EMAIL_SERVICE_URL = "http://email-management:8084/api/email/send"; // Adjust port if different

    public Order createOrder(OrderRequest request) {
        String userId = request.getUserId();
        String userEmail = request.getUserEmail();
        String shippingAddress = request.getShippingAddress();
        List<OrderItem> items = request.getItems();

        // Validate stock and reduce quantity in product service
        for (OrderItem item : items) {
            Long productId = item.getProductId();
            int requestedQty = item.getQuantity();

            // Call product service to get product details
            ProductResponse product = restTemplate.getForObject(
                "http://product-management:8082/api/products/" + productId,
                ProductResponse.class
            );

            if (product == null) {
                throw new RuntimeException("Product not found: ID " + productId);
            }

            if (product.getQuantity() < requestedQty) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Set productName and pricePerUnit from product service response
            item.setProductName(product.getName());
            item.setPricePerUnit(product.getPricePerUnit());

            // Update product quantity in product service
            restTemplate.put("http://product-management:8082/api/products/" + productId +
                "?pricePerUnit=" + product.getPricePerUnit() +
                "&quantity=" + (product.getQuantity() - requestedQty), null);
        }

        // Calculate total
        double total = items.stream()
            .mapToDouble(i -> i.getPricePerUnit() * i.getQuantity())
            .sum();

        // Save Order
        Order order = Order.builder()
            .userId(userId)
            .userEmail(userEmail)
            .shippingAddress(shippingAddress)
            .totalPrice(total)
            .build();

        Order savedOrder = orderRepository.save(order);

        // Save Order Items
        for (OrderItem item : items) {
            item.setOrder(savedOrder);
            orderItemRepository.save(item);
        }

        // --- NEW: Send order confirmation email via API call after successful order save ---
        triggerOrderConfirmationEmail(savedOrder, items);

        return savedOrder;
    }

    /**
     * Helper method to prepare and send the order confirmation email via an API call.
     * @param order The newly saved Order entity.
     * @param orderItems The list of OrderItem entities associated with the order.
     */
    private void triggerOrderConfirmationEmail(Order order, List<OrderItem> orderItems) {

        List<Map<String, Object>> productItemsForEmail = orderItems.stream()
            .map(item -> {
                Map<String, Object> productItemMap = new HashMap<>();
                productItemMap.put("productId", item.getProductId());
                productItemMap.put("productName", item.getProductName());
                productItemMap.put("quantity", item.getQuantity());
                productItemMap.put("pricePerUnit", item.getPricePerUnit());
                return productItemMap;
            })
            .collect(Collectors.toList());

        Map<String, Object> emailRequestBody = new HashMap<>();
        emailRequestBody.put("to", order.getUserEmail());
        emailRequestBody.put("subject", "Your Order Confirmation - Order #" + order.getId());
        emailRequestBody.put("orderId", order.getId()); // Ensure this matches Integer/Long type if needed
        emailRequestBody.put("userEmail", order.getUserEmail());
        emailRequestBody.put("shippingAddress", order.getShippingAddress());
        emailRequestBody.put("totalPrice", order.getTotalPrice());
        emailRequestBody.put("items", productItemsForEmail); // 'items' is the key expected by EmailRequest DTO

        try {
            // Make the POST request to the email service
            ResponseEntity<String> response = restTemplate.postForEntity(
                "http://email-management:8084/api/email/send",
                emailRequestBody,
                String.class // Expecting a String response (e.g., "Email sent successfully")
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("Order confirmation email API call successful for Order ID: " + order.getId());
            } else {
                System.err.println("Order confirmation email API call failed for Order ID: " + order.getId() +
                                   ". Status: " + response.getStatusCode() + ", Body: " + response.getBody());
            }
        } catch (Exception e) {
            System.err.println("An error occurred during API call to email service for Order ID: " + order.getId() + ". Error: " + e.getMessage());
            // Log the error. You might consider an alert or a retry mechanism here.
        }
    }


    public OrderResponseDTO mapToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
            .map(item -> new OrderItemDTO(
                item.getProductId(),
                item.getProductName(),
                item.getQuantity(),
                item.getPricePerUnit()))
            .collect(Collectors.toList());

        return new OrderResponseDTO(
            order.getId(),
            order.getUserId(),
            order.getUserEmail(),
            order.getShippingAddress(),
            order.getTotalPrice(),
            itemDTOs
        );
    }

    // public List<Order> getOrdersByUser(String userId) {
    //    return orderRepository.findByUserId(userId);
    // }

    // public List<OrderItem> getOrderItems(Long orderId) {
    //    Order order = orderRepository.findById(orderId).orElseThrow();
    //    return orderItemRepository.findByOrder(order);
    // }
}