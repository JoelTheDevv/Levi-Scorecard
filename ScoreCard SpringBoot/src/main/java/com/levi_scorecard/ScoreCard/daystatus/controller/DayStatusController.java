package com.levi_scorecard.ScoreCard.daystatus.controller;

import com.levi_scorecard.ScoreCard.dayresults.model.DayResult;
import com.levi_scorecard.ScoreCard.daystatus.repository.DayResultRepository;
import com.levi_scorecard.ScoreCard.daystatus.model.DayStatus;
import com.levi_scorecard.ScoreCard.daystatus.repository.DayStatusRepository;
import com.levi_scorecard.ScoreCard.score.entity.Score;
import com.levi_scorecard.ScoreCard.score.repository.ScoreRepository;
import com.levi_scorecard.ScoreCard.util.BusinessDayUtil;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/day")
public class DayStatusController {

    private final DayStatusRepository dayStatusRepository;
    private final DayResultRepository dayResultRepository;
    private final ScoreRepository scoreRepository;

    public DayStatusController(
            DayStatusRepository dayStatusRepository,
            DayResultRepository dayResultRepository,
            ScoreRepository scoreRepository
    ) {
        this.dayStatusRepository = dayStatusRepository;
        this.dayResultRepository = dayResultRepository;
        this.scoreRepository = scoreRepository;
    }

    @PostMapping("/end")
    public DayStatus endDay() {

        LocalDate businessDate =
                BusinessDayUtil.getCurrentBusinessDate();

        DayStatus dayStatus =
                dayStatusRepository
                        .findByBusinessDate(businessDate)
                        .orElseGet(() ->
                                new DayStatus(
                                        businessDate,
                                        true,
                                        false
                                )
                        );

        if (!dayStatus.isEnded()) {

            List<Score> scores =
                    scoreRepository.findByScoreDate(
                            businessDate
                    );

            List<Score> rankedScores =
                    scores.stream()
                            .sorted(
                                    Comparator.comparing(
                                            Score::getTransfers
                                    ).reversed()
                            )
                            .toList();

            Map<Long, Integer> teamTransfers =
                    scores.stream()
                            .collect(
                                    Collectors.groupingBy(
                                            score -> score
                                                    .getTeam()
                                                    .getId(),
                                            Collectors.summingInt(
                                                    Score::getTransfers
                                            )
                                    )
                            );

            Long winningTeamId =
                    teamTransfers.entrySet()
                            .stream()
                            .max(
                                    Map.Entry.comparingByValue()
                            )
                            .map(Map.Entry::getKey)
                            .orElse(null);

            DayResult result =
                    dayResultRepository
                            .findByBusinessDate(businessDate)
                            .orElseGet(DayResult::new);

            result.setBusinessDate(businessDate);

            if (!rankedScores.isEmpty()) {
                result.setWinnerEmployeeId(
                        rankedScores.get(0)
                                .getEmployee()
                                .getId()
                );
            }

            result.setRunnerUp1EmployeeId(
                    rankedScores.size() > 1
                            ? rankedScores.get(1)
                            .getEmployee()
                            .getId()
                            : null
            );

            result.setRunnerUp2EmployeeId(
                    rankedScores.size() > 2
                            ? rankedScores.get(2)
                            .getEmployee()
                            .getId()
                            : null
            );

            result.setRunnerUp3EmployeeId(
                    rankedScores.size() > 3
                            ? rankedScores.get(3)
                            .getEmployee()
                            .getId()
                            : null
            );

            result.setWinningTeamId(winningTeamId);

            result.setTotalTransfers(
                    scores.stream()
                            .mapToInt(Score::getTransfers)
                            .sum()
            );

            dayResultRepository.save(result);

            dayStatus.setStarted(true);
            dayStatus.setEnded(true);
        }

        return dayStatusRepository.save(dayStatus);
    }

    @GetMapping("/status")
    public DayStatus getDayStatus() {

        LocalDate businessDate =
                BusinessDayUtil.getCurrentBusinessDate();

        return dayStatusRepository
                .findByBusinessDate(businessDate)
                .orElseGet(() ->
                        new DayStatus(
                                businessDate,
                                false,
                                false
                        )
                );
    }

    @PostMapping("/reset")
    public DayStatus resetDay() {

        LocalDate businessDate =
                BusinessDayUtil.getCurrentBusinessDate();

        DayStatus currentDay =
                dayStatusRepository
                        .findByBusinessDate(businessDate)
                        .orElse(null);

        if (currentDay != null && currentDay.isEnded()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "The current business day has already ended."
            );
        }

        if (currentDay == null) {
            DayStatus newDay =
                    new DayStatus(
                            businessDate,
                            true,
                            false
                    );

            return dayStatusRepository.save(newDay);
        }

        return currentDay;
    }
    @GetMapping("/result")
    public DayResult getDayResult() {

        LocalDate businessDate =
                BusinessDayUtil.getCurrentBusinessDate();

        return dayResultRepository
                .findByBusinessDate(businessDate)
                .orElse(null);
    }

    @PostMapping("/resume")
    public DayStatus resumeDay() {

        LocalDate businessDate =
                BusinessDayUtil.getCurrentBusinessDate();

        DayStatus dayStatus =
                dayStatusRepository
                        .findByBusinessDate(businessDate)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Current business day not found."
                                )
                        );

        if (!dayStatus.isStarted()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Current business day has not been started."
            );
        }

        if (!dayStatus.isEnded()) {
            return dayStatus;
        }

        dayStatus.setEnded(false);

        return dayStatusRepository.save(dayStatus);
    }
}