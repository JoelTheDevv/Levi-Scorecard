import { useEffect } from 'react';
import { PartyPopper, Zap } from 'lucide-react';

type TransferCelebrationProps = {
  employeeName: string;
  onComplete: () => void;
};

export function TransferCelebration({
  employeeName,
  onComplete,
}: TransferCelebrationProps) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 2200);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="transfer-celebration">
      <div className="celebration-burst celebration-burst-one" />
      <div className="celebration-burst celebration-burst-two" />
      <div className="celebration-burst celebration-burst-three" />

      <div className="transfer-celebration-card">
        <div className="transfer-celebration-icon">
          <PartyPopper size={34} />
        </div>

        <span className="transfer-celebration-label">
          <Zap size={14} />
          LIVE TRANSFER
        </span>

        <strong>{employeeName}</strong>

        <p>MADE A TRANSFER!</p>
      </div>
    </div>
  );
}