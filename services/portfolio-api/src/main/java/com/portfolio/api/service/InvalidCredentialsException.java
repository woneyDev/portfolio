package com.portfolio.api.service;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("아이디, 이메일 또는 비밀번호가 올바르지 않습니다.");
    }
}
