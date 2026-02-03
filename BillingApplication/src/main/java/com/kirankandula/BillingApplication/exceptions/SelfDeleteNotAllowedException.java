package com.kirankandula.BillingApplication.exceptions;

public class SelfDeleteNotAllowedException extends RuntimeException {

    public SelfDeleteNotAllowedException(String message) {
        super(message);
    }
}