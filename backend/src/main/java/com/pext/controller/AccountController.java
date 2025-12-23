package com.pext.controller;

import com.pext.dto.AccountDTO;
import com.pext.model.Account;
import com.pext.model.Bank;
import com.pext.repository.AccountRepository;
import com.pext.repository.BankRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private BankRepository bankRepository;
    
    @GetMapping
    public ResponseEntity<List<AccountDTO>> getAccounts(@RequestParam(required = false) Long userId) {
        if (userId == null) {
            return ResponseEntity.ok(List.of());
        }
        
        List<Account> accounts = accountRepository.findByUserId(userId);
        List<AccountDTO> accountDTOs = new ArrayList<>();
        
        for (Account account : accounts) {
            Optional<Bank> bankOpt = bankRepository.findById(account.getBankId());
            Bank bank = bankOpt.orElse(null);
            AccountDTO accountDTO = new AccountDTO(account, bank);
            accountDTOs.add(accountDTO);
        }
        
        return ResponseEntity.ok(accountDTOs);
    }
    
    @PostMapping
    public ResponseEntity<?> createAccount(@RequestBody Account account) {
        try {
            Account savedAccount = accountRepository.save(account);
            Optional<Bank> bankOpt = bankRepository.findById(savedAccount.getBankId());
            Bank bank = bankOpt.orElse(null);
            AccountDTO accountDTO = new AccountDTO(savedAccount, bank);
            return ResponseEntity.status(201).body(accountDTO);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to create account");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @PatchMapping("/{id}/link")
    public ResponseEntity<?> linkAccount(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        Optional<Account> accountOpt = accountRepository.findById(id);
        if (accountOpt.isPresent()) {
            Account account = accountOpt.get();
            account.setIsLinked(payload.get("isLinked"));
            Account updatedAccount = accountRepository.save(account);
            Optional<Bank> bankOpt = bankRepository.findById(updatedAccount.getBankId());
            Bank bank = bankOpt.orElse(null);
            AccountDTO accountDTO = new AccountDTO(updatedAccount, bank);
            return ResponseEntity.ok(accountDTO);
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Account not found");
            return ResponseEntity.status(404).body(errorResponse);
        }
    }
}