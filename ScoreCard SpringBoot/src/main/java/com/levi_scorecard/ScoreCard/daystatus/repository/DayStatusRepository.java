package com.levi_scorecard.ScoreCard.daystatus.repository;

import com.levi_scorecard.ScoreCard.daystatus.model.DayStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DayStatusRepository extends JpaRepository<DayStatus, Long> {

    Optional<DayStatus> findByBusinessDate(LocalDate businessDate);
}