interface BarChartProps {
  values: number[];
  labels?: string[];
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function getNiceMax(value: number) {
  if (value <= 0) return 100;

  const exponent = Math.floor(Math.log10(value));
  const fraction = value / Math.pow(10, exponent);

  let niceFraction = 1;

  if (fraction <= 1) {
    niceFraction = 1;
  } else if (fraction <= 2) {
    niceFraction = 2;
  } else if (fraction <= 5) {
    niceFraction = 5;
  } else {
    niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent);
}

export default function BarChart({
  values,
  labels = [],
}: BarChartProps) {
  const rawMax = Math.max(...values, 0);
  const yMax = getNiceMax(rawMax);
  const tickCount = 4;

  const yTicks = Array.from(
    { length: tickCount + 1 },
    (_, index) => (yMax / tickCount) * (tickCount - index),
  );

  const lastNonZeroIndex = (() => {
    for (let i = values.length - 1; i >= 0; i -= 1) {
      if (values[i] > 0) return i;
    }

    return -1;
  })();

  const labelStep =
    values.length <= 10
      ? 1
      : values.length <= 16
        ? 2
        : values.length <= 24
          ? 3
          : 5;

  return (
    <div className="standard-bar-chart">
      <div className="standard-bar-chart__body">
        <div className="standard-bar-chart__y-axis">
          {yTicks.map((tick) => (
            <div
              key={tick}
              className="standard-bar-chart__y-tick"
            >
              {currencyFormatter.format(tick)}
            </div>
          ))}
        </div>

        <div className="standard-bar-chart__plot">
          <div className="standard-bar-chart__grid">
            {yTicks.map((tick) => (
              <div
                key={tick}
                className="standard-bar-chart__grid-line"
              />
            ))}
          </div>

          <div className="standard-bar-chart__bars">
            {values.map((value, index) => {
              const heightPercent =
                yMax <= 0
                  ? 0
                  : (value / yMax) * 100;

              const shouldShowLabel =
                index % labelStep === 0 ||
                index === values.length - 1;

              return (
                <div
                  key={`${index}-${value}`}
                  className="standard-bar-chart__bar-group"
                  title={`${
                    labels[index] ?? `Day ${index + 1}`
                  }: ${currencyFormatter.format(value)}`}
                >
                  <div className="standard-bar-chart__bar-shell">
                    <div
                      className={`standard-bar-chart__bar ${
                        index === lastNonZeroIndex
                          ? "is-highlight"
                          : ""
                      }`}
                      style={{
                        height: `${Math.max(0, heightPercent)}%`,
                      }}
                    />
                  </div>

                  <div className="standard-bar-chart__x-label">
                    {shouldShowLabel
                      ? labels[index]?.split(" ")[0] ??
                        `${index + 1}`
                      : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
