package com.portfolio.api.repository;

import com.portfolio.api.entity.AllowedIp;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AllowedIpRepository extends JpaRepository<AllowedIp, Long> {

    List<AllowedIp> findAll(Sort sort);

    boolean existsByIpAddress(String ipAddress);
}
