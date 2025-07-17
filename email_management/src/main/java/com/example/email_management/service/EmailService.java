// src/main/java/com/example/email_management/service/EmailService.java
package com.example.email_management.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.example.email_management.dto.EmailRequest;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public void sendEmail(EmailRequest request) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(request.getTo()); // This is set to userEmail when preparing the request
        helper.setSubject(request.getSubject());

        Context context = new Context();
        context.setVariable("orderId", request.getOrderId());
        context.setVariable("orderItems", request.getItems()); // Pass the 'items' list
        context.setVariable("totalPrice", request.getTotalPrice());
        context.setVariable("shippingAddress", request.getShippingAddress());
        context.setVariable("userEmail", request.getUserEmail()); // Pass userEmail for display

        String htmlContent = templateEngine.process("order-confirmation", context);
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }
}