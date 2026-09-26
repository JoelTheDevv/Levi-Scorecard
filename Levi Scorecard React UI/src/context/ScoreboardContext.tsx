import { createContext, useContext, type ReactNode } from 'react';
import { useScoreboard } from '@/hooks/useScoreboard';

type ScoreboardContextValue = ReturnType<typeof useScoreboard>;

const ScoreboardContext = createContext<ScoreboardContextValue | undefined>(
  undefined
);

type ScoreboardProviderProps = {
  children: ReactNode;
};

export function ScoreboardProvider({
  children,
}: ScoreboardProviderProps) {
  const scoreboard = useScoreboard();

  return (
    <ScoreboardContext.Provider value={scoreboard}>
      {children}
    </ScoreboardContext.Provider>
  );
}

export function useScoreboardContext() {
  const context = useContext(ScoreboardContext);

  if (!context) {
    throw new Error(
      'useScoreboardContext must be used inside ScoreboardProvider'
    );
  }

  return context;
}