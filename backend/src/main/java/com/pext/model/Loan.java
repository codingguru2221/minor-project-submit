package com.pext.model;

import jakarta.persistence.*;

@Entity
@Table(name = "loans")
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "loan_type")
    private String loanType;
    
    @Column(name = "total_amount")
    private Double totalAmount;
    
    @Column(name = "emi_amount")
    private Double emiAmount;
    
    @Column(name = "remaining_amount")
    private Double remainingAmount;
    
    // Constructors
    public Loan() {}
    
    public Loan(Long userId, String loanType, Double totalAmount, Double emiAmount, Double remainingAmount) {
        this.userId = userId;
        this.loanType = loanType;
        this.totalAmount = totalAmount;
        this.emiAmount = emiAmount;
        this.remainingAmount = remainingAmount;
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
    
    public String getLoanType() {
        return loanType;
    }
    
    public void setLoanType(String loanType) {
        this.loanType = loanType;
    }
    
    public Double getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public Double getEmiAmount() {
        return emiAmount;
    }
    
    public void setEmiAmount(Double emiAmount) {
        this.emiAmount = emiAmount;
    }
    
    public Double getRemainingAmount() {
        return remainingAmount;
    }
    
    public void setRemainingAmount(Double remainingAmount) {
        this.remainingAmount = remainingAmount;
    }
}