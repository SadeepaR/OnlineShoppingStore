package com.example.email_management.controller;

import org.springframework.http.HttpStatus; // Ensure this DTO matches your needs for the template
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping; // Import this
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping; // Import this
import org.springframework.web.bind.annotation.RestController;

import com.example.email_management.dto.EmailRequest;
import com.example.email_management.service.EmailService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {
    private final EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest request) {
        try {
            emailService.sendEmail(request);
            return ResponseEntity.ok("Email sent successfully");
        } catch (MessagingException e) {
            // Log the exception for debugging purposes
            System.err.println("Error sending email: " + e.getMessage());
            // Return an appropriate HTTP error response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to send email: " + e.getMessage());
        }
    }
}