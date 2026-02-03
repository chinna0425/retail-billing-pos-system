package com.kirankandula.BillingApplication.service;

import com.kirankandula.BillingApplication.entity.UserDetailsImpl;
import com.kirankandula.BillingApplication.entity.UserEntity;
import com.kirankandula.BillingApplication.repository.UserJpaRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements UserDetailsService {

    @Autowired
    private UserJpaRepo userJpaRepo;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        UserEntity existingUser = userJpaRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Email not found: " + email));

        return new UserDetailsImpl(existingUser); // ✅ FIX
    }

    public UserDetails loadUserByUserId(String userId) {

        UserEntity existingUser = userJpaRepo.findByUserId(userId)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found: " + userId));

        return new UserDetailsImpl(existingUser); // ✅ FIX
    }
}
