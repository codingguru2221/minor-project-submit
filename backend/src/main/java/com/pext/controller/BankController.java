package com.pext.controller;

import com.pext.model.Bank;
import com.pext.repository.BankRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/banks")
public class BankController {
    
    @Autowired
    private BankRepository bankRepository;
    
    @GetMapping
    public ResponseEntity<List<Bank>> getAllBanks() {
        List<Bank> banks = bankRepository.findAll();
        return ResponseEntity.ok(banks);
    }
    
    // Method to seed banks (for initial setup)
    public void seedBanks() {
        if (bankRepository.count() == 0) {
            Bank[] banks = {
                new Bank("Chase", "Landmark"),
                new Bank("Bank of America", "Building2"),
                new Bank("Citi", "Globe"),
                new Bank("Wells Fargo", "Briefcase"),
                new Bank("Goldman Sachs", "TrendingUp"),
                new Bank("HSBC", "Landmark"),
                new Bank("Barclays", "Building"),
                new Bank("Santander", "CreditCard"),
                new Bank("US Bank", "Wallet"),
                new Bank("PNC", "DollarSign")
            };
            
            for (Bank bank : banks) {
                bankRepository.save(bank);
            }
        }
    }
}