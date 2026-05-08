package com.kishore.expense_tracker.Controller;

import com.kishore.expense_tracker.Model.expense;
import com.kishore.expense_tracker.Service.expenseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/expense-tracker")
public class expenseController {

    private final expenseService ExpenseService;

    public expenseController(expenseService expenseService) {
        ExpenseService = expenseService;
    }

    //route to get all expenses
    @GetMapping("/expense")
    public List<expense> getAllExpenses(){
        return ExpenseService.getAllExpenses();
    }

    //route to create a new expense
    @PostMapping("/createExpense")
    public expense createExpense(@RequestBody expense exp){
        return ExpenseService.createExpense(exp);
    }

    //route to get a expense by id
    @GetMapping("/expense/{id}")
    public expense getExpenseById(@PathVariable String id){
        return ExpenseService.getExpenseById(id);
    }

    //route to update an expense
    @PatchMapping("/updateExpense/{id}")
    public expense updateExpense(@PathVariable String id, @RequestBody expense exp){
        return ExpenseService.updateExpense(id, exp);
    }

    //route to delete and expense
    @DeleteMapping("/delete/{id}")
    public String deleteExpense(@PathVariable String id){
        ExpenseService.deleteExpense(id);
        return "Expense Deleted Successfully";
    }

}
