package com.levi_scorecard.ScoreCard.user.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "login_identifier", nullable = false, unique = true, length = 100)
    private String loginIdentifier;

    @Column(nullable = false, length = 255)
    private String password;

    public User() {
    }

    public User(String loginIdentifier, String password) {
        this.loginIdentifier = loginIdentifier;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public String getLoginIdentifier() {
        return loginIdentifier;
    }

    public String getPassword() {
        return password;
    }

    public void setLoginIdentifier(String loginIdentifier) {
        this.loginIdentifier = loginIdentifier;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}