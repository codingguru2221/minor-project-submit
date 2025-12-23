package com.pext.controller;

import com.pext.model.Transaction;
import com.pext.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions(@RequestParam(required = false) Long accountId) {
        if (accountId == null) {
            List<Transaction> transactions = transactionRepository.findAll();
            return ResponseEntity.ok(transactions);
        } else {
            List<Transaction> transactions = transactionRepository.findByAccountId(accountId);
            return ResponseEntity.ok(transactions);
        }
    }
}