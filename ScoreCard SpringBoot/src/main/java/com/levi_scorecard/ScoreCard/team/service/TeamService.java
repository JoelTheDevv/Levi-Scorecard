package com.levi_scorecard.ScoreCard.team.service;

import com.levi_scorecard.ScoreCard.team.entity.Team;
import com.levi_scorecard.ScoreCard.team.repository.TeamRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamService {

    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Team createTeam(String name) {
        Team team = new Team(name);
        return teamRepository.save(team);
    }
}