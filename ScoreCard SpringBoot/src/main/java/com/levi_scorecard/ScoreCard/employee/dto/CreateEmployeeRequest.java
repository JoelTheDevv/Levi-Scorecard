package com.levi_scorecard.ScoreCard.employee.dto;

public record CreateEmployeeRequest(
        String name,
        Long teamId
) {
}