package com.kishore.expense_tracker.Controller;

import com.kishore.expense_tracker.Model.expense;
import com.kishore.expense_tracker.Model.user;
import com.kishore.expense_tracker.Repository.userRepository;
import com.kishore.expense_tracker.Service.expenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/expense-tracker")
public class expenseController {

    private final expenseService ExpenseService;

    @Autowired
    private userRepository userRepo;

    public expenseController(expenseService expenseService) {
        ExpenseService = expenseService;
    }

    // Helper — gets logged-in user's ID from JWT
    private String getCurrentUserId() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepo.findByEmail(email)
                .orElseThrow().getId();
    }

    // get only THIS user's expenses
    @GetMapping("/expense")
    public List<expense> getAllExpenses() {
        return ExpenseService.getExpensesByUserId(getCurrentUserId());
    }

    // create expense — auto assign userId
    @PostMapping("/createExpense")
    public expense createExpense(@RequestBody expense exp) {
        exp.setUserId(getCurrentUserId());
        return ExpenseService.createExpense(exp);
    }

    // get by id
    @GetMapping("/expense/{id}")
    public expense getExpenseById(@PathVariable String id) {
        return ExpenseService.getExpenseById(id);
    }

    // update — only owner
    @PatchMapping("/updateExpense/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable String id,
                                           @RequestBody expense exp) {
        expense existing = ExpenseService.getExpenseById(id);

        if (!existing.getUserId().equals(getCurrentUserId())) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        return ResponseEntity.ok(ExpenseService.updateExpense(id, exp));
    }

    // delete — only owner
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable String id) {
        expense existing = ExpenseService.getExpenseById(id);

        if (!existing.getUserId().equals(getCurrentUserId())) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        ExpenseService.deleteExpense(id);
        return ResponseEntity.ok("Expense Deleted Successfully");
    }
}