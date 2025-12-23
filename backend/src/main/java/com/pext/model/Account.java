package com.pext.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "bank_id", nullable = false)
    private Long bankId;
    
    @Column(name = "account_number", nullable = false)
    private String accountNumber;
    
    @Column(nullable = false)
    private String type;
    
    @Column(nullable = false)
    private String balance = "0";
    
    @Column(name = "is_linked")
    private Boolean isLinked = false;
    
    @Column(name = "loan_amount")
    private String loanAmount;
    
    @Column(name = "loan_paid")
    private String loanPaid;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public Account() {}
    
    public Account(Long userId, Long bankId, String accountNumber, String type) {
        this.userId = userId;
        this.bankId = bankId;
        this.accountNumber = accountNumber;
        this.type = type;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public Long getBankId() {
        return bankId;
    }
    
    public void setBankId(Long bankId) {
        this.bankId = bankId;
    }
    
    public String getAccountNumber() {
        return accountNumber;
    }
    
    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getBalance() {
        return balance;
    }
    
    public void setBalance(String balance) {
        this.balance = balance;
    }
    
    public Boolean getIsLinked() {
        return isLinked;
    }
    
    public void setIsLinked(Boolean isLinked) {
        this.isLinked = isLinked;
    }
    
    public String getLoanAmount() {
        return loanAmount;
    }
    
    public void setLoanAmount(String loanAmount) {
        this.loanAmount = loanAmount;
    }
    
    public String getLoanPaid() {
        return loanPaid;
    }
    
    public void setLoanPaid(String loanPaid) {
        this.loanPaid = loanPaid;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}