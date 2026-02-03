package com.kirankandula.BillingApplication.service;

import com.kirankandula.BillingApplication.Dtos.*;
import com.kirankandula.BillingApplication.entity.OrderEntity;
import com.kirankandula.BillingApplication.entity.OrderItemEntity;
import com.kirankandula.BillingApplication.exceptions.PaymentVerificationException;
import com.kirankandula.BillingApplication.exceptions.ResourceNotFoundException;
import com.kirankandula.BillingApplication.repository.OrderEntityJpaRepo;
import com.kirankandula.BillingApplication.repository.OrderItemEntityJpaRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.awt.print.Pageable;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderEntityJpaRepo orderEntityJpaRepo;

    @Autowired
    private OrderItemEntityJpaRepo orderItemEntityJpaRepo;

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    public OrderResponse createOrder(OrderRequest request){
        OrderEntity newOrder= convertToOrderEntity(request);
        PaymentDetails paymentDetails=new PaymentDetails();
        paymentDetails.setStatus(newOrder.getPaymentMethod()== PaymentMethod.CASH ?PaymentDetails.PaymentStatus.COMPLETED:PaymentDetails.PaymentStatus.PENDING);
        newOrder.setPaymentDetails(paymentDetails);
        List<OrderItemEntity> orderItems=request.getCartItems().stream().map(this::convertToOrderItemEntity).collect(Collectors.toList());
        newOrder.setItems(orderItems);
        newOrder=orderEntityJpaRepo.save(newOrder);
        return convertToOrderResponse(newOrder);
    }

    public void deleteOrder(String orderId){
        OrderEntity existingOrder= orderEntityJpaRepo.findByOrderId(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found with: " + orderId));
        orderEntityJpaRepo.delete(existingOrder);
    }

    public List<OrderResponse> getLatestOrders(){
        return orderEntityJpaRepo.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToOrderResponse).collect(Collectors.toList()) ;

    }

    public OrderResponse verifyPayment(PaymentVerificationRequest request) {
        System.out.println(request);
        OrderEntity existingOrder= orderEntityJpaRepo.findByOrderId(request.getOrderId()).orElseThrow(()-> new ResourceNotFoundException("Order not found "+request.getOrderId()));
        if(!verifyRazorpaySignature(request.getRazorpayOrderId(),request.getRazorpayPaymentId(),request.getRazorpaySignature())){
            throw new PaymentVerificationException("Payment Verification failed");
        }

        PaymentDetails paymentDetails=existingOrder.getPaymentDetails();

        if (paymentDetails == null) {
            paymentDetails = new PaymentDetails();
        }
        if (paymentDetails.getStatus() == PaymentDetails.PaymentStatus.COMPLETED) {

            throw new PaymentVerificationException("Payment already completed");
        }

        paymentDetails.setRazorpayOrderId(request.getRazorpayOrderId());
        paymentDetails.setRazorpayPaymentId(request.getRazorpayPaymentId());
        paymentDetails.setRazorpaySignature(request.getRazorpaySignature());
        paymentDetails.setStatus(PaymentDetails.PaymentStatus.COMPLETED);
        existingOrder.setPaymentDetails(paymentDetails);
        return convertToOrderResponse(orderEntityJpaRepo.save(existingOrder));
    }

    public Double sumSalesByDate(LocalDate date){
        return orderEntityJpaRepo.sumSalesByDate(date);
    }

    public Long countByOrderDate(LocalDate date){
        return orderEntityJpaRepo.countByOrderDate(date);
    }

    public List<OrderResponse> findRecentOrders(){
        return orderEntityJpaRepo.findRecentOrders(PageRequest.of(0,5))
                .stream().map(this::convertToOrderResponse).collect(Collectors.toList());
    }


    private OrderResponse convertToOrderResponse(OrderEntity newOrder) {
        OrderResponse orderResponse=new OrderResponse();
        orderResponse.setOrderId(newOrder.getOrderId());
        orderResponse.setCustomerName(newOrder.getCustomerName());
        orderResponse.setMobileNumber(newOrder.getMobileNumber());
        orderResponse.setSubtotal(newOrder.getSubtotal());
        orderResponse.setTax(newOrder.getTax());
        orderResponse.setGrandTotal(newOrder.getGrandTotal());
        orderResponse.setPaymentMethod(newOrder.getPaymentMethod());
        orderResponse.setItems(newOrder.getItems().stream().map(this::convertToOrderItemResponse).collect(Collectors.toList()));
        orderResponse.setPaymentDetails(newOrder.getPaymentDetails());
        orderResponse.setCreatedAt(newOrder.getCreatedAt());
        return orderResponse;

    }

    private OrderItemResponse convertToOrderItemResponse(OrderItemEntity orderItemEntity) {
        OrderItemResponse request=new OrderItemResponse();
        request.setItemId(orderItemEntity.getItemId());
        request.setName(orderItemEntity.getName());
        request.setPrice(orderItemEntity.getPrice());
        request.setQuantity(orderItemEntity.getQuantity());
        return request;
    }

    private OrderItemEntity convertToOrderItemEntity(OrderItemRequest orderItemRequest) {
        OrderItemEntity orderItemEntity=new OrderItemEntity();
        orderItemEntity.setItemId(orderItemRequest.getItemId());
        orderItemEntity.setName(orderItemRequest.getName());
        orderItemEntity.setPrice(orderItemRequest.getPrice());
        orderItemEntity.setQuantity(orderItemRequest.getQuantity());
        return orderItemEntity;
    }

    private OrderEntity convertToOrderEntity(OrderRequest request) {
        OrderEntity orderEntity=new OrderEntity();
        orderEntity.setCustomerName(request.getCustomerName());
        orderEntity.setMobileNumber(request.getMobileNumber());
        orderEntity.setTax(request.getTax());
        orderEntity.setGrandTotal(request.getGrandTotal());
        orderEntity.setSubtotal(request.getSubtotal());
        orderEntity.setPaymentMethod(PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase()));
        return orderEntity;
    }


    private boolean verifyRazorpaySignature(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature) {

        try {
            String data = razorpayOrderId + "|" + razorpayPaymentId;

            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey =
                    new SecretKeySpec(razorpaySecret.getBytes(StandardCharsets.UTF_8),
                            "HmacSHA256");

            mac.init(secretKey);

            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            String generatedSignature = bytesToHex(rawHmac);

            return generatedSignature.equals(razorpaySignature);

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder hex = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }

}
