package com.levi_scorecard.ScoreCard.daystatus.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "day_status")
public class DayStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "business_date", nullable = false, unique = true)
    private LocalDate businessDate;

    @Column(name = "ended", nullable = false)
    private boolean ended;

    @Column(name = "started", nullable = false)
    private boolean started;

    public DayStatus() {
    }

    public DayStatus(LocalDate businessDate, boolean started, boolean ended) {
        this.businessDate = businessDate;
        this.started = started;
        this.ended = ended;
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

    public boolean isEnded() {
        return ended;
    }

    public void setEnded(boolean ended) {
        this.ended = ended;
    }

    public boolean isStarted() {
        return started;
    }

    public void setStarted(boolean started) {
        this.started = started;
    }
}