package com.example.product_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.product_management.model.Product;
import com.example.product_management.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepo;

    public Product addProduct(Product product) {
        return productRepo.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    public Product updateProduct(Long id, Double pricePerUnit, Integer quantity) {
        Optional<Product> optionalProduct = productRepo.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setPricePerUnit(pricePerUnit);
            product.setQuantity(quantity);
            return productRepo.save(product);
        }
        throw new RuntimeException("Product not found with id: " + id);
    }
}
