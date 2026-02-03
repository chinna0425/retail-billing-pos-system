package com.kirankandula.BillingApplication.exceptions;

public class PaymentVerificationException extends RuntimeException{
    public PaymentVerificationException(String msg) {
        super(msg);
    }
}
