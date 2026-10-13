import { useEffect, useRef } from 'react';
import { PartyPopper, Zap } from 'lucide-react';
import { playTransferShoutout } from '@/utils/transferShoutout';

type TransferCelebrationProps = {
  employeeName: string;
  onComplete: () => void;
  isSoundOn: boolean
};

export function TransferCelebration({
  employeeName,
  onComplete,
  isSoundOn
}: TransferCelebrationProps) {
  
const shoutoutPlayed = useRef(false);

useEffect(() => {
  const timer = window.setTimeout(onComplete, 6000);

  if (isSoundOn && !shoutoutPlayed.current) {
    shoutoutPlayed.current = true;
    playTransferShoutout(employeeName);
  }

  return () => window.clearTimeout(timer);
}, [onComplete, employeeName, isSoundOn]);


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