interface StatBarProps {
  label: string;
  amount: string;
  progress: number;
}

export default function StatBar({ label, amount, progress }: StatBarProps) {
  return (
    <div className="stat-bar">
      <div className="stat-bar-head">
        <span>{label}</span>
        <strong>{amount}</strong>
      </div>
      <div className="progress-track">
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
