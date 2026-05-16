package com.kishore.expense_tracker.Repository;

import com.kishore.expense_tracker.Model.expense;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface expenseRepository extends MongoRepository<expense, String> {
    List<expense> findByUserId(String userId);
}