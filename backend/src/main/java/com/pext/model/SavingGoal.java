package com.pext.model;

import jakarta.persistence.*;

@Entity
@Table(name = "saving_goals")
public class SavingGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "target_amount")
    private Double targetAmount;
    
    @Column(name = "current_amount")
    private Double currentAmount = 0.0;
    
    private Boolean editable = true;
    
    // Constructors
    public SavingGoal() {}
    
    public SavingGoal(Long userId, Double targetAmount) {
        this.userId = userId;
        this.targetAmount = targetAmount;
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
    
    public Double getTargetAmount() {
        return targetAmount;
    }
    
    public void setTargetAmount(Double targetAmount) {
        this.targetAmount = targetAmount;
    }
    
    public Double getCurrentAmount() {
        return currentAmount;
    }
    
    public void setCurrentAmount(Double currentAmount) {
        this.currentAmount = currentAmount;
    }
    
    public Boolean getEditable() {
        return editable;
    }
    
    public void setEditable(Boolean editable) {
        this.editable = editable;
    }
}