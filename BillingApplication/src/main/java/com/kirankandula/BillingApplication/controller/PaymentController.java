package com.kirankandula.BillingApplication.controller;

import com.kirankandula.BillingApplication.Dtos.PaymentRequest;
import com.kirankandula.BillingApplication.Dtos.PaymentVerificationRequest;

import com.kirankandula.BillingApplication.service.OrderService;
import com.kirankandula.BillingApplication.service.RazorpayService;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    @Autowired
    private RazorpayService razorpayService;

    @Autowired
    private OrderService orderService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody PaymentRequest request) throws RazorpayException {
        return ResponseEntity.status(HttpStatus.CREATED).body(razorpayService.createOrder(request.getAmount(), request.getCurrency()));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request){
        return ResponseEntity.status(HttpStatus.OK).body(orderService.verifyPayment(request));
    }
}
