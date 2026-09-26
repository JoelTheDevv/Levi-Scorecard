package com.levi_scorecard.ScoreCard.score.controller;

import com.levi_scorecard.ScoreCard.score.entity.Score;
import com.levi_scorecard.ScoreCard.score.service.ScoreService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scores")
public class ScoreController {

    private final ScoreService scoreService;

    public ScoreController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @GetMapping("/today")
    public List<Score> getTodayScores() {
        return scoreService.getTodayScores();
    }

    @PostMapping("/{employeeId}/transfer")
    public Score recordTransfer(
            @PathVariable Long employeeId
    ) {
        return scoreService.recordTransfer(employeeId);
    }

    @PostMapping("/{employeeId}/undotransfer")
    public Score undoATransfer(
            @PathVariable Long employeeId
    ) {
        return scoreService.undoATransfer(employeeId);
    }
}