package com.pext.dto;

import com.pext.model.Account;
import com.pext.model.Bank;

public class AccountDTO {
    private Long id;
    private Long userId;
    private Long bankId;
    private String bankName;
    private String accountNumber;
    private String type;
    private String balance;
    private Boolean isLinked;
    private String loanAmount;
    private String loanPaid;
    private java.time.LocalDateTime createdAt;

    public AccountDTO(Account account, Bank bank) {
        this.id = account.getId();
        this.userId = account.getUserId();
        this.bankId = account.getBankId();
        this.bankName = bank != null ? bank.getName() : null;
        this.accountNumber = account.getAccountNumber();
        this.type = account.getType();
        this.balance = account.getBalance();
        this.isLinked = account.getIsLinked();
        this.loanAmount = account.getLoanAmount();
        this.loanPaid = account.getLoanPaid();
        this.createdAt = account.getCreatedAt();
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

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
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

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}