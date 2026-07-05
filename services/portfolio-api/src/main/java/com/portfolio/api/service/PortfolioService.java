package com.portfolio.api.service;

import com.portfolio.api.dto.PortfolioResponse;
import com.portfolio.api.entity.PortfolioOwner;
import com.portfolio.api.repository.PortfolioOwnerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PortfolioService {

    private final PortfolioOwnerRepository ownerRepository;

    public PortfolioService(PortfolioOwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    public PortfolioResponse getPortfolio() {
        PortfolioOwner owner = ownerRepository.findFirstWithAll()
                .orElseThrow(() -> new IllegalStateException("포트폴리오 데이터가 존재하지 않습니다."));
        return new PortfolioResponse(owner);
    }

    @Transactional
    public PortfolioOwner save(PortfolioOwner owner) {
        return ownerRepository.save(owner);
    }
}