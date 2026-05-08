package com.kishore.expense_tracker.Repository;

import com.kishore.expense_tracker.Model.expense;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface expenseRepository extends MongoRepository<expense, String> {
}
