package com.kirankandula.BillingApplication.service;

import com.kirankandula.BillingApplication.Dtos.*;
import com.kirankandula.BillingApplication.entity.Role;
import com.kirankandula.BillingApplication.entity.UserDetailsImpl;
import com.kirankandula.BillingApplication.entity.UserEntity;
import com.kirankandula.BillingApplication.exceptions.InvalidCredentialsException;
import com.kirankandula.BillingApplication.exceptions.ResourceNotFoundException;
import com.kirankandula.BillingApplication.exceptions.SelfDeleteNotAllowedException;
import com.kirankandula.BillingApplication.exceptions.UserAlreadyExistsException;
import com.kirankandula.BillingApplication.repository.UserJpaRepo;
import jakarta.validation.Valid;
import org.apache.commons.text.WordUtils;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {
    @Autowired
    private UserJpaRepo userJpaRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public String encode(EncodeReq request) {
        return passwordEncoder.encode(request.getPassword());
    }

    public UserEntityResponse registerUser(UserEntityRequest request) {
        if(userJpaRepo.existsByEmail(request.getEmail().toLowerCase())){
            throw new UserAlreadyExistsException("User email already exists");
        }
        UserEntity userEntity=convertToEntity(request);
        userEntity=userJpaRepo.save(userEntity);
        return convertToResponse(userEntity);
    }

    private UserEntityResponse convertToResponse(UserEntity userEntity) {
        UserEntityResponse response=new UserEntityResponse();
        response.setName(userEntity.getName());
        response.setUserId(userEntity.getUserId());
        response.setCreatedAt(userEntity.getCreatedAt());
        response.setUpdatedAt(userEntity.getUpdatedAt());
        response.setRole(userEntity.getRole().toString());
        response.setEmail(userEntity.getEmail());
        return response;
    }

    private UserEntity convertToEntity(UserEntityRequest request) {
        UserEntity userEntity=new UserEntity();
        userEntity.setName(WordUtils.capitalizeFully(request.getName().trim()));
        userEntity.setUserId(UUID.randomUUID().toString());
        userEntity.setRole(Role.ROLE_USER);
        userEntity.setPassword(passwordEncoder.encode(request.getPassword()));
        userEntity.setEmail(request.getEmail().trim().toLowerCase());
        return userEntity;
    }

    public AuthResponse login(AuthRequest request) throws InvalidCredentialsException {
        UserEntity userEntity=userJpaRepo.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(()->new InvalidCredentialsException("Invalid Credentails"));
        if (!passwordEncoder.matches(request.getPassword(), userEntity.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        UserDetailsImpl userDetails = new UserDetailsImpl(userEntity);
        String token=jwtService.generateToken(userDetails);
        AuthResponse response=new AuthResponse();
        response.setToken(token);
        response.setRole(userEntity.getRole().name());
        return response;
    }

    public void deleteUser(String userId) {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        UserDetailsImpl user =
                (UserDetailsImpl) auth.getPrincipal();

        String loggedInUserId = user.getUserId();

        if (loggedInUserId.equals(userId)) {
            throw new SelfDeleteNotAllowedException(
                    "You cannot delete your own account"
            );
        }

        UserEntity userEntity=userJpaRepo.findByUserId(userId).orElseThrow(()-> new ResourceNotFoundException("User not found with "+userId));
        userJpaRepo.delete(userEntity);
    }

    public List<UserEntityResponse> getAllUsers() {
        List<UserEntity> userEntities=userJpaRepo.findAll();
        List<UserEntityResponse> responses=new ArrayList<>();
        for(UserEntity user:userEntities){
            responses.add(convertToResponse(user));
        }
        return responses;
    }
}
