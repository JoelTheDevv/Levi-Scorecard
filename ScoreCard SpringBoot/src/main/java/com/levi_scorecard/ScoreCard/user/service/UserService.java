package com.levi_scorecard.ScoreCard.user.service;

import com.levi_scorecard.ScoreCard.user.entity.User;
import com.levi_scorecard.ScoreCard.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findByLoginIdentifier(String loginIdentifier) {
        return userRepository.findByLoginIdentifier(loginIdentifier)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}