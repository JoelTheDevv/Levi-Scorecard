package com.levi_scorecard.ScoreCard.score.entity;

import com.levi_scorecard.ScoreCard.employee.entity.Employee;
import com.levi_scorecard.ScoreCard.team.entity.Team;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "scores",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_employee_score_date",
                        columnNames = {"employee_id", "score_date"}
                )
        }
)
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(nullable = false)
    private Integer transfers = 0;

    @Column(name = "score_date", nullable = false)
    private LocalDate scoreDate;

    public Score() {
    }

    public Score(
            Employee employee,
            Team team,
            Integer transfers,
            LocalDate scoreDate
    ) {
        this.employee = employee;
        this.team = team;
        this.transfers = transfers;
        this.scoreDate = scoreDate;
    }

    public Long getId() {
        return id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public Team getTeam() {
        return team;
    }

    public Integer getTransfers() {
        return transfers;
    }

    public LocalDate getScoreDate() {
        return scoreDate;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public void setTransfers(Integer transfers) {
        this.transfers = transfers;
    }

    public void setScoreDate(LocalDate scoreDate) {
        this.scoreDate = scoreDate;
    }
}