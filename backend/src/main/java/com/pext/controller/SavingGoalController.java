package com.pext.controller;

import com.pext.model.SavingGoal;
import com.pext.repository.SavingGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/saving-goals")
public class SavingGoalController {
    
    @Autowired
    private SavingGoalRepository savingGoalRepository;
    
    @GetMapping
    public ResponseEntity<List<SavingGoal>> getSavingGoals(@RequestParam(required = false) Long userId) {
        if (userId == null) {
            return ResponseEntity.ok(List.of());
        }
        
        List<SavingGoal> savingGoals = savingGoalRepository.findByUserId(userId);
        return ResponseEntity.ok(savingGoals);
    }
}