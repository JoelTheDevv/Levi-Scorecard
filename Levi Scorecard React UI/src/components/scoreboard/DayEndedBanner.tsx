import { ArrowUpRight, Award } from 'lucide-react';

type DayEndedBannerProps = {
  onViewResults: () => void;
};

export function DayEndedBanner({ onViewResults }: DayEndedBannerProps) {
  return (
    <div className="day-ended-banner">
      <div>
        <Award size={24} />
        <div>
          <span>DAY COMPLETE</span>
          <strong>Final results are in. What a performance.</strong>
        </div>
      </div>
      <button onClick={onViewResults}>
        View final results <ArrowUpRight size={16} />
      </button>
    </div>
  );
}
