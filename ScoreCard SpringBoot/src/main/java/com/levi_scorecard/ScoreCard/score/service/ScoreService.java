package com.levi_scorecard.ScoreCard.score.service;

import com.levi_scorecard.ScoreCard.employee.entity.Employee;
import com.levi_scorecard.ScoreCard.employee.repository.EmployeeRepository;
import com.levi_scorecard.ScoreCard.score.entity.Score;
import com.levi_scorecard.ScoreCard.score.repository.ScoreRepository;
import com.levi_scorecard.ScoreCard.util.BusinessDayUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ScoreService {

    private final ScoreRepository scoreRepository;
    private final EmployeeRepository employeeRepository;

    public ScoreService(
            ScoreRepository scoreRepository,
            EmployeeRepository employeeRepository
    ) {
        this.scoreRepository = scoreRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<Score> getTodayScores() {
        LocalDate businessDate =
                BusinessDayUtil.getCurrentBusinessDate();

        return scoreRepository.findByScoreDate(
                businessDate
        );
    }

    public Score recordTransfer(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        LocalDate today = BusinessDayUtil.getCurrentBusinessDate();

        Score score = scoreRepository
                .findByEmployeeIdAndScoreDate(employeeId, today)
                .orElseGet(() -> new Score(
                        employee,
                        employee.getTeam(),
                        0,
                        today
                ));

        score.setTeam(employee.getTeam());
        score.setTransfers(score.getTransfers() + 1);

        return scoreRepository.save(score);
    }

    public Score undoATransfer(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        LocalDate today = BusinessDayUtil.getCurrentBusinessDate();

        Score score = scoreRepository
                .findByEmployeeIdAndScoreDate(employeeId, today)
                .orElseGet(() -> new Score(
                        employee,
                        employee.getTeam(),
                        0,
                        today
                ));

        if(score.getTransfers() > 0) {
            score.setTeam(employee.getTeam());
            score.setTransfers(score.getTransfers() - 1);
        }

        return scoreRepository.save(score);
    }
}