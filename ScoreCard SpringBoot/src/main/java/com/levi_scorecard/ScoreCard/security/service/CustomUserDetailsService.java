package com.levi_scorecard.ScoreCard.security.service;

import com.levi_scorecard.ScoreCard.user.entity.User;
import com.levi_scorecard.ScoreCard.user.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {

        User user = userRepository.findByLoginIdentifier(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getLoginIdentifier())
                .password(user.getPassword())
                .authorities("USER")
                .build();
    }
}