package com.portfolio.api.service;

public class InvalidOAuthStateException extends RuntimeException {
    public InvalidOAuthStateException() {
        super("로그인 요청이 만료되었거나 위조되었습니다. 다시 시도해주세요.");
    }
}
