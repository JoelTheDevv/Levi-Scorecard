package com.levi_scorecard.ScoreCard.score.repository;

import com.levi_scorecard.ScoreCard.score.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ScoreRepository extends JpaRepository<Score, Long> {

    Optional<Score> findByEmployeeIdAndScoreDate(
            Long employeeId,
            LocalDate scoreDate
    );

    List<Score> findByScoreDate(LocalDate scoreDate);
}