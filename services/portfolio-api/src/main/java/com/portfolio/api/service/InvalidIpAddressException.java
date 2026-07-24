package com.portfolio.api.service;

public class InvalidIpAddressException extends RuntimeException {
    public InvalidIpAddressException(String message) {
        super(message);
    }
}
