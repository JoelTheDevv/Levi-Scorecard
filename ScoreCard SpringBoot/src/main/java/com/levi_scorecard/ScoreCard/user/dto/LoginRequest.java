package com.levi_scorecard.ScoreCard.user.dto;

public record LoginRequest(
        String loginIdentifier,
        String password
) {
}