package com.levi_scorecard.ScoreCard.config;

import com.levi_scorecard.ScoreCard.user.entity.User;
import com.levi_scorecard.ScoreCard.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createTestUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            if (userRepository.findByLoginIdentifier("admin").isEmpty()) {

                User user = new User(
                        "admin",
                        passwordEncoder.encode("admin123")
                );

                userRepository.save(user);
            }
        };
    }
}