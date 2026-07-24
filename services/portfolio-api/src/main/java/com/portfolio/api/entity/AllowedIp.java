package com.portfolio.api.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "admin_allowed_ip",
       uniqueConstraints = @UniqueConstraint(name = "uq_admin_allowed_ip_address", columnNames = "ip_address"))
public class AllowedIp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ip_address", nullable = false, length = 45)
    private String ipAddress;

    @Column(length = 100)
    private String memo;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public AllowedIp() {}

    public AllowedIp(String ipAddress, String memo) {
        this.ipAddress = ipAddress;
        this.memo = memo;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getMemo() { return memo; }
    public void setMemo(String memo) { this.memo = memo; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
