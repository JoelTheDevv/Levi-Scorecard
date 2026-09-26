package com.levi_scorecard.ScoreCard.util;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;

public final class BusinessDayUtil {

    private static final ZoneId INDIA_ZONE =
            ZoneId.of("Asia/Kolkata");

    private static final LocalTime BUSINESS_DAY_END =
            LocalTime.of(18, 0);

    private BusinessDayUtil() {
    }

    public static LocalDate getCurrentBusinessDate() {

        LocalDate currentDate =
                LocalDate.now(INDIA_ZONE);

        LocalTime currentTime =
                LocalTime.now(INDIA_ZONE);

        if (currentTime.isBefore(BUSINESS_DAY_END)) {
            return currentDate.minusDays(1);
        }

        return currentDate;
    }
}