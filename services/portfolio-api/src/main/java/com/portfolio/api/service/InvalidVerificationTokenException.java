package com.portfolio.api.service;

public class InvalidVerificationTokenException extends RuntimeException {
    public InvalidVerificationTokenException() {
        super("인증 링크가 유효하지 않거나 만료되었습니다.");
    }
}
