package com.levi_scorecard.ScoreCard.team.repository;

import com.levi_scorecard.ScoreCard.team.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {
}