package com.example.product_management.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.image.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Maps requests to /images/** to the physical directory where images are stored inside the container.
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + uploadDir); // Crucial for absolute file paths
    }
}