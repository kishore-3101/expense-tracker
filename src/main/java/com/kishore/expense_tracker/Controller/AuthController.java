package com.kishore.expense_tracker.Controller;

import com.kishore.expense_tracker.DTO.LoginRequest;
import com.kishore.expense_tracker.DTO.RegisterRequest;
import com.kishore.expense_tracker.Model.user;
import com.kishore.expense_tracker.Repository.userRepository;
import com.kishore.expense_tracker.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")   // ← add this
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private userRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        // check if email already exists
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        user newUser = new user();
        newUser.setName(req.getName());
        newUser.setEmail(req.getEmail());
        newUser.setPassword(passwordEncoder.encode(req.getPassword())); // BCrypt hash

        userRepo.save(newUser);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        // validates email + password against MongoDB
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        // if valid, generate JWT
        String token = jwtUtil.generateToken(req.getEmail());
        return ResponseEntity.ok(Map.of("token", token));
    }
}