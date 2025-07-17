package com.example.product_management.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart; // Import this
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.example.product_management.model.Product;
import com.example.product_management.repository.ProductRepository;
import com.example.product_management.service.ProductService;


@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired // Now required if you intend to save product data
    private ProductService productService;

    @Autowired // Now required if you intend to save product data
    private ProductRepository productRepository;

    @Value("${app.image.upload-dir}")
    private String uploadDir;

    @Value("${app.image.base-url}")
    private String baseUrl;

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // IMPORTANT: Changed return type to Product if you want to return the saved product details
    public ResponseEntity<Product> addProduct( // Renamed back to addProduct for clarity
        @RequestPart("product") Product product, // <--- RE-INTRODUCED PRODUCT PART
        @RequestPart("image") MultipartFile imageFile
    ) throws IOException {
        File dir = new File(uploadDir);
        if (!dir.exists()){
            dir.mkdirs();
            // Ensure the directory exists before saving the file
            // This is crucial for avoiding FileNotFoundException
        }
        String filename = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        File dest = new File(uploadDir + filename);
        imageFile.transferTo(dest);

        String imageUrl = baseUrl + filename; // Construct the URL

        // --- THIS IS THE MISSING PART: Saving product details to the database ---
        product.setImageUrl(imageUrl); // Assuming your Product model has an 'imageUrl' field
        Product savedProduct = productService.addProduct(product); // Call service to save

        return ResponseEntity.ok(savedProduct); // Return the saved product with its ID and image URL
    }

    // Keep other methods if they are still relevant for your product service
    // Ensure ProductService/Repository are properly configured with a database for these to work.
    @GetMapping
    public List<Product> getAllProducts() {
        // No longer throwing NOT_IMPLEMENTED if productService is now required
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        // No longer throwing NOT_IMPLEMENTED if productRepository is now required
        return productRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id,
                                 @RequestParam Double pricePerUnit,
                                 @RequestParam Integer quantity) {
        // No longer throwing NOT_IMPLEMENTED if productService is now required
        return productService.updateProduct(id, pricePerUnit, quantity);
    }
}
