package com.portfolio.api.service;

import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;

/**
 * 커스텀 섹션 내용(리치 텍스트 에디터에서 온 HTML)을 저장 전에 살균 처리한다.
 * 서식(굵게·기울임·정렬·글자크기)과 목록·링크 정도만 허용하고, 스크립트 등 위험 요소는 전부 제거한다.
 */
public final class HtmlSanitizer {

    private static final PolicyFactory POLICY = Sanitizers.FORMATTING
            .and(Sanitizers.BLOCKS)
            .and(Sanitizers.STYLES)
            .and(Sanitizers.LINKS);

    private HtmlSanitizer() {}

    public static String sanitize(String html) {
        return html == null ? "" : POLICY.sanitize(html);
    }
}
