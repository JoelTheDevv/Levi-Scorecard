package com.levi_scorecard.ScoreCard.team.controller;

import com.levi_scorecard.ScoreCard.team.dto.CreateTeamRequest;
import com.levi_scorecard.ScoreCard.team.entity.Team;
import com.levi_scorecard.ScoreCard.team.service.TeamService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    public List<Team> getAllTeams() {
        return teamService.getAllTeams();
    }

    @PostMapping
    public Team createTeam(@RequestBody CreateTeamRequest request) {
        return teamService.createTeam(request.name());
    }
}