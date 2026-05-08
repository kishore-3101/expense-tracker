package com.kishore.expense_tracker.Service;

import com.kishore.expense_tracker.Model.expense;
import com.kishore.expense_tracker.Repository.expenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class expenseService {

    private final expenseRepository expenseRepo;

    //constructor for expenseRepository
    public expenseService(expenseRepository expense) {
        this.expenseRepo = expense;
    }

    //create a new expense
    public expense createExpense(expense exp){
        return expenseRepo.save(exp);
    }

    //get all expenses
    public List<expense> getAllExpenses(){
        return expenseRepo.findAll();
    }

    public expense getExpenseById(String id){
        return expenseRepo.findById(id).orElse(null);
    }

    //update the expense
    public expense updateExpense(String id, expense exp){
        expense oldExpense = expenseRepo.findById(id).orElse(null);

        if(oldExpense == null){
            return null;
        }
        if(exp.getAmount() != null) oldExpense.setAmount(exp.getAmount());
        if(exp.getDescription() != null) oldExpense.setDescription(exp.getDescription());
        if(exp.getDate() != null) oldExpense.setDate(exp.getDate());

        return expenseRepo.save(oldExpense);
    }

    //delete expense by id
    public void deleteExpense(String id){
         expenseRepo.deleteById(id);
    }

}
