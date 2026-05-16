package com.kishore.expense_tracker.Model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "users")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class user {

    @Id
    private String id;
    private String name;
    @Indexed(unique = true)
    private String email;
    private String password;

    public String getId(){ return id; }
    public void setId(String id){
        this.id = id;
    }

    public String getName(){ return name; }
    public void setName(String name){
        this.name = name;
    }

    public String getEmail(){ return email; }
    public void setEmail(String email){
        this.email = email;
    }

    public String getPassword(){ return password; }
    public void setPassword(String password){
        this.password = password;
    }

}
