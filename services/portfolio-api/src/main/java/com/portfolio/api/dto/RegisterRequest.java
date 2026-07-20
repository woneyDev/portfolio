package com.portfolio.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email
        String email,

        @NotBlank @Size(min = 8, max = 72, message = "비밀번호는 8자 이상 72자 이하로 입력해주세요.")
        String password,

        @NotBlank
        String passwordConfirm,

        @NotBlank @Size(min = 1, max = 30, message = "닉네임은 1자 이상 30자 이하로 입력해주세요.")
        String nickname,

        @NotBlank @Size(max = 100, message = "소속은 100자 이하로 입력해주세요.")
        String affiliation
) {
}
