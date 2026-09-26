package com.levi_scorecard.ScoreCard.user.repository;

import com.levi_scorecard.ScoreCard.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByLoginIdentifier(String loginIdentifier);
}