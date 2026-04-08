package com.kirankandula.BillingApplication.controller;

import com.kirankandula.BillingApplication.Dtos.AuthRequest;
import com.kirankandula.BillingApplication.Dtos.EncodeReq;
import com.kirankandula.BillingApplication.Dtos.UserEntityRequest;
import com.kirankandula.BillingApplication.exceptions.InvalidCredentialsException;
import com.kirankandula.BillingApplication.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;


    @PostMapping("/encode")
    public ResponseEntity<?> encode(@RequestBody EncodeReq request){
        return ResponseEntity.status(HttpStatus.OK).body(authService.encode(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/users/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserEntityRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerUser(request));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) throws InvalidCredentialsException {
        return ResponseEntity.status(HttpStatus.OK).body(authService.login(request));
    }

    @GetMapping("/users/all-users")
    public ResponseEntity<?> getAllUsers(){
        return ResponseEntity.status(HttpStatus.OK).body(authService.getAllUsers());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/user/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId){
        authService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
