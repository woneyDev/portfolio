package com.portfolio.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Pattern(regexp = "^[a-z0-9][a-z0-9_-]{2,29}$", message = "아이디는 소문자/숫자/_/-만 사용해 3~30자로 입력해주세요.")
        String username,

        @NotBlank @Email
        String email,

        @NotBlank @Size(min = 8, max = 72, message = "비밀번호는 8자 이상 72자 이하로 입력해주세요.")
        String password
) {
}
