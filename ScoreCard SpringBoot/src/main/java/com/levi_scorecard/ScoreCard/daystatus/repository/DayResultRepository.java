package com.levi_scorecard.ScoreCard.daystatus.repository;

import com.levi_scorecard.ScoreCard.dayresults.model.DayResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DayResultRepository
        extends JpaRepository<DayResult, Long> {

    Optional<DayResult> findByBusinessDate(LocalDate businessDate);
}