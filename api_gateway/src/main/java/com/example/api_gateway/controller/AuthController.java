package com.example.api_gateway.controller;

import com.example.api_gateway.dto.AuthRequest;
import com.example.api_gateway.dto.AuthResponse;
import com.example.api_gateway.dto.RegisterRequest;
import com.example.api_gateway.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        if (response.getToken() != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        if (response.getToken() != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestParam String token) {
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(isValid);
    }

    @GetMapping("/user")
    public ResponseEntity<String> getUserFromToken(@RequestParam String token) {
        if (authService.validateToken(token)) {
            String username = authService.extractUsername(token);
            String role = authService.extractRole(token);
            return ResponseEntity.ok("User: " + username + ", Role: " + role);
        } else {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }
}
