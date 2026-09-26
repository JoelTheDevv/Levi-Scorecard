package com.levi_scorecard.ScoreCard.dayresults.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "day_results")
public class DayResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "business_date", nullable = false, unique = true)
    private LocalDate businessDate;

    @Column(name = "winner_employee_id")
    private Long winnerEmployeeId;

    @Column(name = "runner_up_1_employee_id")
    private Long runnerUp1EmployeeId;

    @Column(name = "runner_up_2_employee_id")
    private Long runnerUp2EmployeeId;

    @Column(name = "runner_up_3_employee_id")
    private Long runnerUp3EmployeeId;

    @Column(name = "winning_team_id")
    private Long winningTeamId;

    @Column(name = "total_transfers", nullable = false)
    private Integer totalTransfers = 0;

    public DayResult() {
    }

    public Long getId() {
        return id;
    }

    public LocalDate getBusinessDate() {
        return businessDate;
    }

    public void setBusinessDate(LocalDate businessDate) {
        this.businessDate = businessDate;
    }

    public Long getWinnerEmployeeId() {
        return winnerEmployeeId;
    }

    public void setWinnerEmployeeId(Long winnerEmployeeId) {
        this.winnerEmployeeId = winnerEmployeeId;
    }

    public Long getRunnerUp1EmployeeId() {
        return runnerUp1EmployeeId;
    }

    public void setRunnerUp1EmployeeId(Long runnerUp1EmployeeId) {
        this.runnerUp1EmployeeId = runnerUp1EmployeeId;
    }

    public Long getRunnerUp2EmployeeId() {
        return runnerUp2EmployeeId;
    }

    public void setRunnerUp2EmployeeId(Long runnerUp2EmployeeId) {
        this.runnerUp2EmployeeId = runnerUp2EmployeeId;
    }

    public Long getRunnerUp3EmployeeId() {
        return runnerUp3EmployeeId;
    }

    public void setRunnerUp3EmployeeId(Long runnerUp3EmployeeId) {
        this.runnerUp3EmployeeId = runnerUp3EmployeeId;
    }

    public Long getWinningTeamId() {
        return winningTeamId;
    }

    public void setWinningTeamId(Long winningTeamId) {
        this.winningTeamId = winningTeamId;
    }

    public Integer getTotalTransfers() {
        return totalTransfers;
    }

    public void setTotalTransfers(Integer totalTransfers) {
        this.totalTransfers = totalTransfers;
    }
}