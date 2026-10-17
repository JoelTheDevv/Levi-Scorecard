package com.levi_scorecard.ScoreCard.user.dto;


public class PassChangeRequest {
    private String currentPassword;
    private String newPassword;
    private String loginIdentifier;
    private String secretCode;

    public String getSecretCode() {
        return secretCode;
    }

    public PassChangeRequest() {
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setSecretCode(String secretCode) {
        this.secretCode = secretCode;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getLoginIdentifier() {
        return loginIdentifier;
    }

    public void setLoginIdentifier(String loginIdentifier) {
        this.loginIdentifier = loginIdentifier;
    }
}
