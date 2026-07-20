package com.portfolio.api.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.api.dto.CreateCustomSectionRequest;
import com.portfolio.api.dto.PortfolioResponse;
import com.portfolio.api.dto.UpdateCustomSectionRequest;
import com.portfolio.api.dto.UpdateLayoutRequest;
import com.portfolio.api.dto.UpdatePortfolioRequest;
import com.portfolio.api.entity.CustomSection;
import com.portfolio.api.entity.PortfolioOwner;
import com.portfolio.api.entity.SectionLayout;
import com.portfolio.api.entity.SectionType;
import com.portfolio.api.repository.CustomSectionRepository;
import com.portfolio.api.repository.PortfolioOwnerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Comparator;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class PortfolioService {

    private static final Logger log = LoggerFactory.getLogger(PortfolioService.class);
    private static final String CACHE_KEY_PREFIX = "portfolio:content:";
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);

    private final PortfolioOwnerRepository ownerRepository;
    private final CustomSectionRepository customSectionRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    public PortfolioService(PortfolioOwnerRepository ownerRepository,
                             CustomSectionRepository customSectionRepository,
                             RedisTemplate<String, String> redisTemplate,
                             ObjectMapper objectMapper) {
        this.ownerRepository = ownerRepository;
        this.customSectionRepository = customSectionRepository;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * 공개 조회용 — 방문자가 보는 특정 회원의 포트폴리오. Redis에 JSON 문자열을 캐싱합니다(cache-aside).
     * 언어별로 따로 캐싱한다 — 두 언어를 한 번에 다 내려주지 않고, 방문자가 언어를 바꿀 때만 그 언어로 새로 요청한다.
     */
    public String getPortfolioJsonByUsername(String username, String lang) {
        String cacheKey = CACHE_KEY_PREFIX + username + ":" + lang;
        String cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;
        }

        PortfolioOwner owner = ownerRepository.findByMemberUsernameWithAll(username)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다: " + username));

        String json = writeJson(new PortfolioResponse(owner, lang));
        redisTemplate.opsForValue().set(cacheKey, json, CACHE_TTL);
        return json;
    }

    /**
     * 로그인한 회원 본인의 포트폴리오 조회 (마이페이지·관리자 대시보드용 — 항상 한글 기준으로 편집한다).
     */
    public PortfolioResponse getMyPortfolio(Long memberId) {
        PortfolioOwner owner = ownerRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new NoSuchElementException("포트폴리오를 찾을 수 없습니다."));
        return new PortfolioResponse(owner, "ko");
    }

    @Transactional
    public PortfolioResponse updateMyPortfolio(Long memberId, UpdatePortfolioRequest request) {
        PortfolioOwner owner = ownerRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new NoSuchElementException("포트폴리오를 찾을 수 없습니다."));

        // 관리 대상 엔티티의 필드만 바꿔서 저장합니다 — skills/projects/careers는 cascade=ALL,
        // orphanRemoval=true이므로 새 PortfolioOwner를 만들어 통째로 save()하면 자식 데이터가 전부 삭제됩니다.
        owner.setTitle(request.title());
        owner.setSubtitle(request.subtitle());
        owner.setEmail(request.email());
        owner.setGithubUrl(request.githubUrl());

        invalidateCache(owner.getMember().getUsername());

        return new PortfolioResponse(owner, "ko");
    }

    /**
     * 마이페이지에서 회원이 4개 섹션(자기소개/스킬/프로젝트/경력사항)의 배치(위치·크기·표시여부)를 바꿀 때 호출됨.
     * 섹션 종류(sectionType)당 기존 행이 있으면 갱신, 없으면 새로 만든다(upsert).
     */
    @Transactional
    public PortfolioResponse updateMyLayout(Long memberId, UpdateLayoutRequest request) {
        PortfolioOwner owner = ownerRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new NoSuchElementException("포트폴리오를 찾을 수 없습니다."));

        Map<SectionType, SectionLayout> existing = owner.getSectionLayouts().stream()
                .collect(Collectors.toMap(SectionLayout::getSectionType, Function.identity()));

        for (UpdateLayoutRequest.Item item : request.sections()) {
            SectionType sectionType = parseSectionType(item.sectionType());
            SectionLayout layout = existing.get(sectionType);
            if (layout == null) {
                layout = new SectionLayout();
                layout.setOwner(owner);
                layout.setSectionType(sectionType);
                owner.getSectionLayouts().add(layout);
                existing.put(sectionType, layout);
            }
            layout.setGridX(item.x());
            layout.setGridY(item.y());
            layout.setGridWidth(item.w());
            layout.setGridHeight(item.h());
            layout.setVisible(item.visible());
        }

        if (request.customSections() != null) {
            Map<Long, CustomSection> existingCustom = owner.getCustomSections().stream()
                    .collect(Collectors.toMap(CustomSection::getId, Function.identity()));

            for (UpdateLayoutRequest.CustomItem item : request.customSections()) {
                CustomSection section = existingCustom.get(item.id());
                if (section == null) {
                    throw new InvalidLayoutException("존재하지 않는 커스텀 섹션입니다: " + item.id());
                }
                section.setGridX(item.x());
                section.setGridY(item.y());
                section.setGridWidth(item.w());
                section.setGridHeight(item.h());
                section.setVisible(item.visible());
            }
        }

        invalidateCache(owner.getMember().getUsername());

        return new PortfolioResponse(owner, "ko");
    }

    /**
     * 회원이 마이페이지에서 "+ 새 섹션 추가"로 자유 형식(제목+내용) 섹션을 만들 때 호출됨.
     * 위치는 현재 보이는 섹션들(고정 4개 + 기존 커스텀 섹션) 중 가장 아래 칸 다음 줄, 전체 폭으로 배정한다.
     */
    @Transactional
    public PortfolioResponse addCustomSection(Long memberId, CreateCustomSectionRequest request) {
        PortfolioOwner owner = ownerRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new NoSuchElementException("포트폴리오를 찾을 수 없습니다."));

        int maxY = maxBottomY(owner);

        CustomSection section = new CustomSection();
        section.setOwner(owner);
        section.setTitle(request.title());
        section.setContent(HtmlSanitizer.sanitize(request.content()));
        section.setGridX(0);
        section.setGridY(maxY);
        section.setGridWidth(12);
        section.setGridHeight(2);
        section.setVisible(true);

        // owner.getCustomSections()에만 add()하면 cascade는 트랜잭션 커밋 시점에야 실행되어,
        // 바로 아래에서 PortfolioResponse를 만들 때 이 섹션의 id(IDENTITY 생성)가 아직 null이다.
        // save()로 직접 즉시 insert시켜 id를 확정한 뒤에 응답을 만든다.
        customSectionRepository.save(section);
        owner.getCustomSections().add(section);

        invalidateCache(owner.getMember().getUsername());

        return new PortfolioResponse(owner, "ko");
    }

    /**
     * 커스텀 섹션의 제목·내용 수정. 본인 소유 섹션인지는 owner의 컬렉션 안에서만 찾으므로 자동으로 검증된다.
     */
    @Transactional
    public PortfolioResponse updateCustomSection(Long memberId, Long sectionId, UpdateCustomSectionRequest request) {
        PortfolioOwner owner = ownerRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new NoSuchElementException("포트폴리오를 찾을 수 없습니다."));

        CustomSection section = findOwnCustomSection(owner, sectionId);
        section.setTitle(request.title());
        section.setContent(HtmlSanitizer.sanitize(request.content()));

        invalidateCache(owner.getMember().getUsername());

        return new PortfolioResponse(owner, "ko");
    }

    /**
     * 커스텀 섹션 완전 삭제. 기존 4개 고정 섹션은 "숨기기"만 가능하고 삭제는 불가하지만,
     * 커스텀 섹션은 회원이 직접 만든 것이므로 완전히 지울 수 있다.
     */
    @Transactional
    public PortfolioResponse deleteCustomSection(Long memberId, Long sectionId) {
        PortfolioOwner owner = ownerRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new NoSuchElementException("포트폴리오를 찾을 수 없습니다."));

        CustomSection section = findOwnCustomSection(owner, sectionId);
        owner.getCustomSections().remove(section);

        invalidateCache(owner.getMember().getUsername());

        return new PortfolioResponse(owner, "ko");
    }

    private CustomSection findOwnCustomSection(PortfolioOwner owner, Long sectionId) {
        return owner.getCustomSections().stream()
                .filter(s -> s.getId().equals(sectionId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 커스텀 섹션입니다: " + sectionId));
    }

    private int maxBottomY(PortfolioOwner owner) {
        int maxFromFixed = owner.getSectionLayouts().stream()
                .filter(SectionLayout::isVisible)
                .map(l -> l.getGridY() + l.getGridHeight())
                .max(Comparator.naturalOrder())
                .orElse(0);
        int maxFromCustom = owner.getCustomSections().stream()
                .filter(CustomSection::isVisible)
                .map(c -> c.getGridY() + c.getGridHeight())
                .max(Comparator.naturalOrder())
                .orElse(0);
        return Math.max(maxFromFixed, maxFromCustom);
    }

    private void invalidateCache(String username) {
        redisTemplate.delete(CACHE_KEY_PREFIX + username + ":ko");
        redisTemplate.delete(CACHE_KEY_PREFIX + username + ":en");
    }

    private SectionType parseSectionType(String value) {
        try {
            return SectionType.valueOf(value);
        } catch (IllegalArgumentException e) {
            throw new InvalidLayoutException("알 수 없는 섹션 종류입니다: " + value);
        }
    }

    private String writeJson(PortfolioResponse response) {
        try {
            return objectMapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            log.error("포트폴리오 JSON 직렬화 실패", e);
            throw new IllegalStateException("포트폴리오 데이터를 처리할 수 없습니다.", e);
        }
    }
}
