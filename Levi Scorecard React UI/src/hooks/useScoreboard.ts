import {
  useEffect,
  useCallback,
  useMemo,
  useState,
  useRef,
} from 'react';

import type {
  Employee,
  Team,
  Activity,
  RankedTeam,
} from '@/types';

import {
  endDay as endDayApi,
  getDayStatus,
  resetDay as resetDayApi,
  undoTransfer as undoTransferApi,
  getTeams,
  getEmployees,
  getTodayScores,
  recordTransfer as recordTransferApi,
  createTeam,
  createEmployee,
  reassignEmployee as reassignEmployeeApi,
  getDayResult,
  resumeDay as resumeDayApi,
} from '@/api/api';

import {
  motivationalMessages,
  teamColorPalette,
  defaultTarget,
} from '@/data/mockData';

import {
  computeTotal,
  computeProgress,
  computeRemaining,
  rankEmployees,
  rankTeams,
  getTeamScore,
  getFirstName,
  getRandomMotivationalMessage,
} from '@/utils/scoreboardUtils';

export type TransferResult = {
  movedToFirst: boolean;
  movedTeamToFirst: boolean;
  teamName: string | undefined;
  employeeName: string;
  isTargetAchieved: boolean;
};

export type TransferCelebration = {
  id: number;
  employeeName: string;
};

type BackendTeam = {
  id: number;
  name: string;
};

type BackendEmployee = {
  id: number;
  name: string;
  team: BackendTeam;
};

type BackendScore = {
  id: number;
  employee: BackendEmployee;
  team: BackendTeam;
  transfers: number;
  scoreDate: string;
};

export function useScoreboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [target, setTarget] = useState(defaultTarget);
  const [dayStarted, setDayStarted] = useState(false);
  const [dayEnded, setDayEnded] = useState(false);

  const [endedBusinessDate, setEndedBusinessDate] =
    useState<string | null>(null);

  const [currentBusinessDate, setCurrentBusinessDate] =
    useState<string | null>(null);

  const [dayResults, setDayResults] = useState<{
    winner: Employee | null;
    runnerUps: Employee[];
    winningTeam: RankedTeam | null;
    totalTransfers: number;
  } | null>(null);

  const [announcement, setAnnouncement] = useState('');
  const [flashId, setFlashId] = useState<string | null>(null);
  const [isSoundOn, setIsSoundOn] = useState(true);

  const [transferQueue, setTransferQueue] =
    useState<TransferCelebration[]>([]);

  const [previousEmployeeOrder, setPreviousEmployeeOrder] =
    useState<string[]>([]);

  const [previousTeamOrder, setPreviousTeamOrder] =
    useState<string[]>([]);

  /*
   * Stores the transfer count seen during the previous
   * successful scoreboard load.
   *
   * This allows the public scoreboard to detect transfers
   * made from another computer/system.
   */
  const previousTransferCounts =
    useRef<Map<number, number> | null>(null);

  const total = useMemo(
    () => computeTotal(employees),
    [employees]
  );

  const progress = computeProgress(total, target);
  const remaining = computeRemaining(total, target);

  const rankedEmployees = useMemo(
    () => rankEmployees(employees),
    [employees]
  );

  const rankedTeams = useMemo(
    () => rankTeams(teams, employees),
    [teams, employees]
  );

  const leader = rankedEmployees[0];

  const teamLeader: RankedTeam | undefined =
    rankedTeams[0];

  const isTargetHit = total >= target;

  /*
   * A new day can be started only after:
   *
   * 1. The current business day has ended.
   * 2. The backend has moved to a different business date.
   *
   * The day-status polling logic updates endedBusinessDate
   * and dayEnded accordingly.
   */
 const canStartNewDay =
  dayEnded &&
  endedBusinessDate !== null &&
  currentBusinessDate !== null &&
  currentBusinessDate !== endedBusinessDate;

const canResumeDay =
  dayStarted &&
  dayEnded &&
  endedBusinessDate === currentBusinessDate;

  useEffect(() => {
    document.title =
      'Live Call Transfer Scorecard';
  }, []);

  /*
   * Loads the current scoreboard data.
   *
   * This remains responsible only for:
   * - teams
   * - employees
   * - scores
   * - transfer detection
   *
   * Final day results are loaded separately from
   * the persistent day_results table.
   */
  const loadScoreboard = useCallback(async () => {
    try {
      const [
        backendTeams,
        backendEmployees,
        backendScores,
      ] = await Promise.all([
        getTeams() as Promise<BackendTeam[]>,
        getEmployees() as Promise<BackendEmployee[]>,
        getTodayScores() as Promise<BackendScore[]>,
      ]);

      const mappedTeams: Team[] =
        backendTeams.map((team, index) => ({
          id: String(team.id),
          name: team.name,
          color:
            teamColorPalette[
              index % teamColorPalette.length
            ],
          short: team.name
            .charAt(0)
            .toUpperCase(),
        }));

      const scoreMap =
        new Map<number, number>();

      backendScores.forEach((score) => {
        scoreMap.set(
          score.employee.id,
          score.transfers
        );
      });

      /*
       * Detect transfers that happened outside this
       * browser/system.
       */
      if (previousTransferCounts.current !== null) {
        const previousCounts =
          previousTransferCounts.current;

        backendEmployees.forEach(
          (backendEmployee) => {
            const currentCount =
              scoreMap.get(
                backendEmployee.id
              ) ?? 0;

            const previousCount =
              previousCounts.get(
                backendEmployee.id
              ) ?? 0;

            const newTransfers =
              currentCount - previousCount;

            if (newTransfers > 0) {
              if (isSoundOn) {
                playCelebrationSound();
              }
              for (
                let index = 0;
                index < newTransfers;
                index++
              ) {
                setTransferQueue(
                  (current) => [
                    ...current,
                    {
                      id:
                        Date.now() +
                        index +
                        backendEmployee.id,
                      employeeName:
                        backendEmployee.name,
                    },
                  ]
                );
              }

              setActivities((current) =>
                [
                  {
                    id: Date.now(),
                    employee:
                      backendEmployee.name,
                    team:
                      backendEmployee.team.name,
                    time: 'just now',
                    type:
                      'transfer' as const,
                  },
                  ...current,
                ].slice(0, 7)
              );

              setAnnouncement(
                `${getFirstName(
                  backendEmployee.name
                )} recorded a transfer.`
              );
            }
          }
        );
      }

      /*
       * Store the latest backend counts only after
       * successfully processing the response.
       */
      previousTransferCounts.current =
        new Map(
          backendEmployees.map(
            (employee) => [
              employee.id,
              scoreMap.get(
                employee.id
              ) ?? 0,
            ]
          )
        );

      const mappedEmployees: Employee[] =
        backendEmployees.map(
          (employee) => ({
            id: String(employee.id),
            name: employee.name,
            role: 'Calling Agent',
            teamId: String(
              employee.team.id
            ),
            transfers:
              scoreMap.get(
                employee.id
              ) ?? 0,
          })
        );

      setTeams(mappedTeams);
      setEmployees(mappedEmployees);

      setPreviousEmployeeOrder(
        rankEmployees(
          mappedEmployees
        ).map(
          (employee) => employee.id
        )
      );

      setPreviousTeamOrder(
        rankTeams(
          mappedTeams,
          mappedEmployees
        ).map(
          (team) => team.id
        )
      );
    } catch (error) {
      console.error(
        'Failed to load scoreboard:',
        error
      );
    }
  }, []);

  /*
   * Monitors the current business-day status.
   *
   * This effect does NOT load final celebration data.
   * It only determines whether the business day is ended
   * and whether a new business date has arrived.
   */
  useEffect(() => {
    loadScoreboard();

    const checkDayStatus = async () => {
  try {
    const status = await getDayStatus();

    /*
     * Store the current business date and
     * whether the business day has been started.
     */
    setCurrentBusinessDate(status.businessDate);
    setDayStarted(status.started);

    /*
     * Current business day is ended.
     */
    if (status.ended) {
      setEndedBusinessDate(status.businessDate);
      setDayEnded(true);
      return;
    }

    /*
     * A new business date has arrived.
     *
     * The previous business day was ended, so
     * clear the old celebration and scoreboard state
     * and start displaying the new business date.
     */
    if (
      dayEnded &&
      endedBusinessDate !== null &&
      status.businessDate !== endedBusinessDate
    ) {
      setEndedBusinessDate(null);
      setDayStarted(status.started);
      setDayEnded(false);
      setDayResults(null);
      setTransferQueue([]);
      setActivities([]);
      setAnnouncement('');

      previousTransferCounts.current = null;

      await loadScoreboard();

      return;
    }

    /*
     * Current business day is active.
     *
     * This also handles resuming an ended day.
     * Clear the old celebration state.
     */
    setDayEnded(false);
    setDayResults(null);
    setEndedBusinessDate(null);

  } catch (error) {
    console.error(
      'Failed to check day status:',
      error
    );
  }
};

    checkDayStatus();

    const interval =
      window.setInterval(() => {
        loadScoreboard();
        checkDayStatus();
      }, 3000);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    loadScoreboard,
    dayEnded,
    endedBusinessDate,
  ]);

  /*
   * Loads the final celebration result from the database.
   *
   * This is deliberately separate from the day-status
   * polling so that browser refreshes work correctly.
   *
   * We wait until employees are loaded because the saved
   * day result contains employee IDs rather than complete
   * employee objects.
   */
  useEffect(() => {
    if (
      !dayEnded ||
      !endedBusinessDate ||
      employees.length === 0
    ) {
      return;
    }

    const loadSavedDayResult =
      async () => {
        try {
          const savedResult =
            await getDayResult();

          if (!savedResult) {
            return;
          }

          const employeeMap =
            new Map(
              employees.map(
                (employee) => [
                  employee.id,
                  employee,
                ]
              )
            );

          const winner =
            savedResult.winnerEmployeeId !=
            null
              ? employeeMap.get(
                  String(
                    savedResult.winnerEmployeeId
                  )
                ) ?? null
              : null;

          const runnerUps = [
            savedResult.runnerUp1EmployeeId,
            savedResult.runnerUp2EmployeeId,
            savedResult.runnerUp3EmployeeId,
          ]
            .filter(
              (id): id is number =>
                id != null
            )
            .map(
              (id) =>
                employeeMap.get(
                  String(id)
                )
            )
            .filter(
              (
                employee
              ): employee is Employee =>
                employee !== undefined
            );

          const winningTeam =
            rankedTeams.find(
              (team) =>
                team.id ===
                String(
                  savedResult.winningTeamId
                )
            ) ?? null;

          setDayResults({
            winner,
            runnerUps,
            winningTeam,
            totalTransfers:
              savedResult.totalTransfers,
          });

        } catch (error) {
          console.error(
            'Failed to load saved day result:',
            error
          );
        }
      };

    loadSavedDayResult();

  }, [
    dayEnded,
    endedBusinessDate,
    employees,
    rankedTeams,
  ]);

  useEffect(() => {
    if (!announcement) {
      return;
    }

    const timer =
      window.setTimeout(
        () =>
          setAnnouncement(''),
        3500
      );

    return () =>
      window.clearTimeout(timer);
  }, [announcement]);

  const toggleSound = () => {
    setIsSoundOn(
      (current) => !current
    );
  };

  const completeTransferCelebration =
    useCallback(() => {
      setTransferQueue(
        (current) =>
          current.slice(1)
      );
    }, []);

  const playCelebrationSound = async () => {
  const AudioContextClass =
    window.AudioContext ||
    (
      window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const context = new AudioContextClass();

  try {
    if (context.state === 'suspended') {
      await context.resume();
    }

    const now = context.currentTime;

    const playNote = (
      frequency: number,
      startTime: number,
      duration: number,
      volume: number
    ) => {
      const oscillator =
        context.createOscillator();

      const gain =
        context.createGain();

      oscillator.type = 'sine';

      oscillator.frequency.setValueAtTime(
        frequency,
        now + startTime
      );

      gain.gain.setValueAtTime(
        0.001,
        now + startTime
      );

      gain.gain.exponentialRampToValueAtTime(
        volume,
        now + startTime + 0.02
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + startTime + duration
      );

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start(
        now + startTime
      );

      oscillator.stop(
        now + startTime + duration
      );
    };

    // Cheerful "Ta-Da!" style melody
    playNote(659.25, 0.00, 0.14, 0.14); // E5
    playNote(783.99, 0.10, 0.14, 0.15); // G5
    playNote(987.77, 0.20, 0.16, 0.16); // B5
    playNote(1046.50, 0.32, 0.20, 0.18); // C6

    // Bright finishing flourish
    playNote(1318.51, 0.48, 0.22, 0.17); // E6
    playNote(1567.98, 0.60, 0.32, 0.14); // G6

    // Small sparkle
    playNote(1975.53, 0.72, 0.18, 0.08); // B6
    playNote(2637.02, 0.78, 0.24, 0.05); // E7

    window.setTimeout(() => {
      void context.close();
    }, 1200);

  } catch (error) {
    console.error(
      'Failed to play celebration sound:',
      error
    );

    void context.close();
  }
};

const recordTransfer = async (
  employeeId: string
): Promise<TransferResult | null> => {
  const employee =
    employees.find(
      (item) =>
        item.id === employeeId
    );

  if (!employee || !dayStarted || dayEnded) {
    return null;
  }

  try {
    await recordTransferApi(
      Number(employeeId)
    );
  } catch (error) {
    console.error(
      'Failed to record transfer:',
      error
    );

    return null;
  }

  const newCount =
    employee.transfers + 1;

  const nextEmployees =
    employees.map(
      (item) =>
        item.id === employeeId
          ? {
              ...item,
              transfers:
                newCount,
            }
          : item
    );

  const nextEmployeeOrder =
    rankEmployees(
      nextEmployees
    ).map(
      (item) => item.id
    );

  const movedToFirst =
    nextEmployeeOrder[0] ===
      employeeId &&
    previousEmployeeOrder[0] !==
      employeeId;

  const team =
    teams.find(
      (item) =>
        item.id ===
        employee.teamId
    );

  const nextTeamScores =
    teams
      .map((item) => ({
        id: item.id,
        score: getTeamScore(
          item.id,
          nextEmployees
        ),
      }))
      .sort(
        (a, b) =>
          b.score - a.score
      );

  const movedTeamToFirst =
    nextTeamScores[0]?.id ===
      employee.teamId &&
    previousTeamOrder[0] !==
      employee.teamId;

  setEmployees(
    nextEmployees
  );

  setPreviousEmployeeOrder(
    nextEmployeeOrder
  );

  setPreviousTeamOrder(
    nextTeamScores.map(
      (item) => item.id
    )
  );

  setTransferQueue(
    (current) => [
      ...current,
      {
        id: Date.now(),
        employeeName:
          employee.name,
      },
    ]
  );

  setFlashId(
    employeeId
  );

  window.setTimeout(
    () =>
      setFlashId(null),
    750
  );

  setActivities(
    (current) =>
      [
        {
          id: Date.now(),
          employee:
            employee.name,
          team:
            team?.name ??
            'Team',
          time: 'just now',
          type:
            'transfer' as const,
        },
        ...current,
      ].slice(0, 7)
  );

  const firstName =
    getFirstName(
      employee.name
    );

  setAnnouncement(
    movedToFirst
      ? `${firstName} takes the lead.`
      : getRandomMotivationalMessage(
          motivationalMessages
        )
  );

  if (isSoundOn) {
    playCelebrationSound();
  }

  if (movedToFirst) {
    window.setTimeout(
      () =>
        setAnnouncement(
          `${firstName} is now #1.`
        ),
      500
    );
  }

  if (movedTeamToFirst) {
    window.setTimeout(
      () =>
        setAnnouncement(
          `${
            team?.name ??
            'The team'
          } takes the lead.`
        ),
      900
    );
  }

  const isTargetAchieved =
    total < target &&
    total + 1 >= target;

  if (isTargetAchieved) {
    window.setTimeout(
      () =>
        setAnnouncement(
          'Target achieved. Extraordinary work.'
        ),
      1000
    );
  }

  return {
    movedToFirst,
    movedTeamToFirst,
    teamName:
      team?.name,
    employeeName:
      employee.name,
    isTargetAchieved,
  };
};

const handleRecordTransferUndo = async (
  employeeId: string
) => {
  const employee =
    employees.find(
      (item) =>
        item.id === employeeId
    );

  if (
    !employee ||
    !dayStarted ||
    dayEnded ||
    employee.transfers <= 0
  ) {
    return;
  }

  try {
    await undoTransferApi(
      Number(employeeId)
    );
  } catch (error) {
    console.error(
      'Failed to undo transfer:',
      error
    );

    return;
  }

  const newCount =
    employee.transfers - 1;

  const nextEmployees =
    employees.map(
      (item) =>
        item.id === employeeId
          ? {
              ...item,
              transfers:
                newCount,
            }
          : item
    );

  const nextEmployeeOrder =
    rankEmployees(
      nextEmployees
    ).map(
      (item) => item.id
    );

  const nextTeamScores =
    teams
      .map((item) => ({
        id: item.id,
        score: getTeamScore(
          item.id,
          nextEmployees
        ),
      }))
      .sort(
        (a, b) =>
          b.score - a.score
      );

  setEmployees(
    nextEmployees
  );

  setPreviousEmployeeOrder(
    nextEmployeeOrder
  );

  setPreviousTeamOrder(
    nextTeamScores.map(
      (item) => item.id
    )
  );
};


  const resetDay = useCallback(async () => {
    try {
      const result = await resetDayApi();
      console.log('RESET DAY RESULT:', result);
      if (result.ended) {
        window.alert(
          'Cannot start a new day. The current business day has already ended.'
        );

        return;
      }

      setDayStarted(result.started);
      setDayEnded(result.ended);

      setDayResults(null);
      setTransferQueue([]);
      setActivities([]);
      setAnnouncement('');
      setEndedBusinessDate(null);

      previousTransferCounts.current = null;

      await loadScoreboard();

      setAnnouncement(
        'New business day started. Let us make it count.'
      );

    } catch (error) {
      console.error(
        'Failed to start new business day:',
        error
      );

      window.alert(
        'Cannot start a new day. The current business day has already ended.'
      );
    }
  }, [loadScoreboard]);

  const resumeDay = useCallback(async () => {
  try {
    const result = await resumeDayApi();
    
    setDayStarted(result.started);
    setDayEnded(result.ended);

    setDayResults(null);
    setEndedBusinessDate(null);

    setTransferQueue([]);
    setAnnouncement('');
  } catch (error) {
    console.error('Failed to resume day:', error);
  }
}, []);

  /*
   * Ends the current business day.
   *
   * The backend now calculates and permanently saves
   * the final result. The frontend only changes the
   * day state here.
   *
   * The saved result is loaded by the separate
   * day-result effect above.
   */
  const endDay =
    useCallback(async () => {
      try {
        const result =
          await endDayApi();

        if (!result.ended) {
          return;
        }

        setDayStarted(result.started);
        setDayEnded(result.ended);

        setEndedBusinessDate(
          result.businessDate
        );

      } catch (error) {
        console.error(
          'Failed to end day:',
          error
        );
      }
    }, []);

  const addTeam = async (
    name: string
  ) => {
    const trimmed =
      name.trim();

    if (!trimmed) {
      return;
    }

    try {
      await createTeam(
        trimmed
      );

      await loadScoreboard();

      setAnnouncement(
        `${trimmed} is ready to compete.`
      );
    } catch (error) {
      console.error(
        'Failed to create team:',
        error
      );

      setAnnouncement(
        'Failed to create team.'
      );
    }
  };

  const addEmployee = async (
    name: string,
    teamId: string
  ) => {
    const trimmed =
      name.trim();

    if (!trimmed || !teamId) {
      return;
    }

    try {
      await createEmployee(
        trimmed,
        Number(teamId)
      );

      await loadScoreboard();

      setAnnouncement(
        `${trimmed} joined the scoreboard.`
      );
    } catch (error) {
      console.error(
        'Failed to create employee:',
        error
      );

      setAnnouncement(
        'Failed to create employee.'
      );
    }
  };

  const reassignEmployee =
    async (
      employeeId: string,
      teamId: string
    ) => {
      const employee =
        employees.find(
          (item) =>
            item.id ===
            employeeId
        );

      const team =
        teams.find(
          (item) =>
            item.id === teamId
        );

      if (!employee || !team) {
        return;
      }

      try {
        await reassignEmployeeApi(
          Number(employeeId),
          Number(teamId)
        );

        await loadScoreboard();

        setAnnouncement(
          `${employee.name} moved to ${team.name}.`
        );
      } catch (error) {
        console.error(
          'Failed to reassign employee:',
          error
        );

        setAnnouncement(
          'Failed to reassign employee.'
        );
      }
    };

  const setDailyTarget = (
    newTarget: number
  ) => {
    if (newTarget > 0) {
      setTarget(newTarget);
    }
  };

  return {
    employees,
    teams,
    activities,
    target,
    dayStarted,
    dayEnded,
    dayResults,
    announcement,
    flashId,
    transferQueue,
    completeTransferCelebration,
    isSoundOn,
    total,
    progress,
    remaining,
    rankedEmployees,
    rankedTeams,
    leader,
    teamLeader,
    isTargetHit,
    recordTransfer,
    undoTransfer: handleRecordTransferUndo,
    toggleSound,
    resetDay,
    endDay,
    addTeam,
    addEmployee,
    reassignEmployee,
    setDailyTarget,
    setAnnouncement,
    canStartNewDay,
    currentBusinessDate,
    canResumeDay,
    resumeDay,
  };
}