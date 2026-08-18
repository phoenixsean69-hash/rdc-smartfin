interface BarChartProps {
  values: number[];
}

export default function BarChart({ values }: BarChartProps) {
  const max = Math.max(...values);

  return (
    <div className="bar-chart" aria-label="Static monthly revenue bar chart">
      {values.map((value, index) => (
        <span
          key={`${index}-${value}`}
          className={index === values.length - 2 ? "highlight" : ""}
          style={{ height: `${Math.max(18, (value / max) * 100)}%` }}
          title={`Day ${index + 1}: ${value}`}
        />
      ))}
    </div>
  );
}
