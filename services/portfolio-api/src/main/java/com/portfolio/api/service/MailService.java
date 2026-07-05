package com.portfolio.api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * 인증 메일 발송 실패가 회원가입 자체를 막지 않도록 예외를 삼키고 로그만 남깁니다.
     * (로컬 개발 환경처럼 메일 서버 자격증명이 비어있을 때도 가입 흐름은 계속 진행됩니다.)
     */
    public void sendVerificationEmail(String toEmail, String verificationUrl) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("[포트폴리오 플랫폼] 이메일 인증을 완료해주세요");
            message.setText("아래 링크를 눌러 이메일 인증을 완료해주세요 (24시간 이내 유효):\n\n" + verificationUrl);
            mailSender.send(message);
        } catch (MailException e) {
            log.warn("인증 메일 발송 실패 (to={}): {}", toEmail, e.getMessage());
        }
    }
}
