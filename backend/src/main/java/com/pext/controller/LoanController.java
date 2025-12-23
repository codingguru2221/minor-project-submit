package com.pext.controller;

import com.pext.model.Loan;
import com.pext.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {
    
    @Autowired
    private LoanRepository loanRepository;
    
    @GetMapping
    public ResponseEntity<List<Loan>> getLoans(@RequestParam(required = false) Long userId) {
        if (userId == null) {
            return ResponseEntity.ok(List.of());
        }
        
        List<Loan> loans = loanRepository.findByUserId(userId);
        return ResponseEntity.ok(loans);
    }
}