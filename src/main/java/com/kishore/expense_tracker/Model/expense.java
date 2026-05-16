package com.kishore.expense_tracker.Model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Document(collection = "expenses")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class expense {

    @Id
    private String id;

    private String userId;
    private Double amount;
    private String description;
    private LocalDate date;

    // getters and setters id
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    // getters and setter for userid
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    // getters and setter for amount
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    // getters and setter for description
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    // getters and setter for date
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}