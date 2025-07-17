package com.example.order_management.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.order_management.dto.OrderRequest;
import com.example.order_management.dto.OrderResponseDTO;
import com.example.order_management.model.Order;
import com.example.order_management.repository.OrderRepository;
import com.example.order_management.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.ok(order);
    }

    
    @GetMapping("/user-orders")
    public ResponseEntity<List<OrderResponseDTO>> getUserOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderResponseDTO> dtos = orders.stream()
            .map(orderService::mapToDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }


    // // @GetMapping("/user/{userId}")
    // // public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
    // //     return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    // // }

    // // @GetMapping("/{orderId}/items")
    // // public ResponseEntity<List<OrderItem>> getOrderItems(@PathVariable Long orderId) {
    // //     return ResponseEntity.ok(orderService.getOrderItems(orderId));
    // // }
}
