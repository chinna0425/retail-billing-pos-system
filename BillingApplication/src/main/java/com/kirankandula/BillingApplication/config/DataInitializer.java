package com.kirankandula.BillingApplication.config;

import com.kirankandula.BillingApplication.entity.Role;
import com.kirankandula.BillingApplication.entity.UserEntity;
import com.kirankandula.BillingApplication.repository.UserJpaRepo;
import org.apache.commons.text.WordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Autowired
    private UserJpaRepo userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin already exists
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            UserEntity admin=new UserEntity();
            admin.setName(WordUtils.capitalizeFully("Chinna".trim()));
            admin.setUserId(UUID.randomUUID().toString());
            admin.setRole(Role.ROLE_ADMIN);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setEmail(adminEmail.trim().toLowerCase());
            userRepository.save(admin);
        }
    }
}
