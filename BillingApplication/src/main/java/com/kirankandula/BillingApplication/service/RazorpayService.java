package com.kirankandula.BillingApplication.service;

import com.kirankandula.BillingApplication.Dtos.RazorpayOrderResponse;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public RazorpayOrderResponse createOrder(Double amount,String currency) throws RazorpayException {
        RazorpayClient razorpayClient=new RazorpayClient(razorpayKeyId,razorpayKeySecret);
        JSONObject orderRequest=new JSONObject();
        orderRequest.put("amount",amount*100);
        orderRequest.put("currency",currency);
        orderRequest.put("receipt","order_rcptid_"+System.currentTimeMillis());
        orderRequest.put("payment_capture",1);
        Order order=razorpayClient.orders.create(orderRequest);
        System.out.println(order);
        return convertToResponse(order);
    }

    private RazorpayOrderResponse convertToResponse(Order order) {
        RazorpayOrderResponse response=new RazorpayOrderResponse();
        response.setId(order.get("id"));
        response.setEntity(order.get("entity"));
        response.setAmount(order.get("amount"));
        response.setCurrency(order.get("currency"));
        response.setStatus(order.get("status"));
        response.setCreatedAt(order.get("created_at"));
        response.setReceipt(order.get("receipt"));
        return response;
    }
}
