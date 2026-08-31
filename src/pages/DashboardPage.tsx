import {
  useEffect,
  useState,
  type ComponentType,
} from "react";

import {
  BadgeDollarSign,
  Building2,
  CircleDollarSign,
  Database,
  Droplets,
  Lightbulb,
  Receipt,
  Store,
  Trash2,
} from "lucide-react";

import BarChart from "../components/BarChart";
import StatBar from "../components/StatBar";

import {
  getCachedDashboardData,
  loadDashboardData,
  type DashboardData,
} from "../services/dashboardService";
import type { SectionId } from "../types";

const categoryIcons:
  Record<
    string,
    ComponentType<{
      size?: number;
    }>
  > = {
    "Property Rates":
      Building2,

    "Business Licence":
      Store,

    "Business Licences":
      Store,

    "Water Charges":
      Droplets,

    Water:
      Droplets,

    "Refuse Collection":
      Trash2,

    "Market Fees":
      Receipt,

    "Development Levy":
      CircleDollarSign,

    "Development Levies":
      CircleDollarSign,
  };

const money =
  new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  );

const percent =
  new Intl.NumberFormat(
    "en-US",
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    },
  );

interface DashboardPageProps {
  onNavigate: (section: SectionId) => void;
}

export default function DashboardPage({
  onNavigate,
}: DashboardPageProps) {
  const [
    data,
    setData,
  ] =
    useState<DashboardData | null>(
      getCachedDashboardData,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      () => !getCachedDashboardData(),
    );

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    refreshKey,
    setRefreshKey,
  ] =
    useState(0);

  useEffect(() => {
    let cancelled =
      false;

    const load =
      async () => {
        setLoading(true);
        setError("");

        try {
          const result =
            await loadDashboardData();

          if (
            !cancelled
          ) {
            setData(
              (current) =>
                current === result
                  ? current
                  : result,
            );
          }
        } catch (err) {
          if (
            !cancelled
          ) {
            setError(
              err instanceof
                Error
                ? err.message
                : "Unable to load dashboard data.",
            );
          }
        } finally {
          if (
            !cancelled
          ) {
            setLoading(
              false,
            );
          }
        }
      };

    void load();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (
    loading &&
    !data
  ) {
    return (
      <div className="dashboard-layout">
        <main className="main-content">
          <header className="page-header">
            <div>
              <p className="eyebrow">
                COUNCIL FINANCE
              </p>

              <h2>
                Revenue Overview
              </h2>

              <p className="date-range">
                Connecting to
                SmartPay...
              </p>
            </div>
          </header>

          <section className="chart-panel">
            <div className="section-title-row">
              <div>
                <h3>
                  Loading live
                  council data
                </h3>

                <p>
                  Reading payments,
                  bills,
                  expenditure and
                  AI insights from
                  Appwrite.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (
    error &&
    !data
  ) {
    return (
      <div className="dashboard-layout">
        <main className="main-content">
          <header className="page-header">
            <div>
              <p className="eyebrow">
                COUNCIL FINANCE
              </p>

              <h2>
                Dashboard
                unavailable
              </h2>

              <p className="date-range">
                {error}
              </p>
            </div>

            <button
              type="button"
              className="ghost-button"
              onClick={() =>
                setRefreshKey(
                  (
                    current,
                  ) =>
                    current +
                    1,
                )
              }
            >
              Retry
            </button>
          </header>
        </main>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const kpis = [
    {
      label:
        "Revenue collected",

      value:
        money.format(
          data.metrics
            .revenueCollected,
        ),

      meta:
        `${data.metrics.completedPaymentCount} completed payments`,

      tone:
        "good",

      destination:
        "payments" as const,
    },

    {
      label:
        "Outstanding",

      value:
        money.format(
          data.metrics
            .outstandingBalance,
        ),

      meta:
        `${data.metrics.outstandingBillCount} bills carry balances`,

      tone:
        "neutral",

      destination:
        "residents" as const,
    },

    {
      label:
        "Expenditure",

      value:
        money.format(
          data.metrics
            .approvedExpenditure,
        ),

      meta:
        `${data.metrics.approvedExpenditureCount} approved entries`,

      tone:
        "neutral",

      destination:
        "expenditure" as const,
    },

    {
      label:
        "Collection rate",

      value:
        `${percent.format(
          data.metrics
            .collectionRate,
        )}%`,

      meta:
        `${money.format(
          data.metrics
            .revenueCollected,
        )} recorded`,

      tone:
        data.metrics
            .collectionRate >=
          70
          ? "good"
          : "neutral",

      destination:
        "revenue" as const,
    },
  ];

  const groups =
    Array.from(
      new Set(
        data.transactions.map(
          (
            transaction,
          ) =>
            transaction.dateGroup,
        ),
      ),
    );

  const updatedTime =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    ).format(
      new Date(
        data.updatedAt,
      ),
    );

  const revenueSources =
    data.revenueSources.slice(0, 5);

  const collectionDaysRecorded =
    data.dailyCollections.filter(
      (amount) => amount > 0,
    ).length;

  const revenueSourceTotal =
    revenueSources.reduce(
      (total, source) =>
        total + source.amount,
      0,
    );

  const doughnutColors = [
    "#2f80ed",
    "#203e66",
    "#35b89b",
    "#f3a33d",
    "#8f6ee8",
  ];

  let cumulativeShare = 0;
  const revenueSlices = revenueSources.map(
    (source, index) => {
      const share =
        revenueSourceTotal > 0
          ? (source.amount / revenueSourceTotal) * 100
          : 0;
      const start = cumulativeShare;
      cumulativeShare += share;

      return {
        ...source,
        color: doughnutColors[index],
        share,
        start,
        end: cumulativeShare,
      };
    },
  );

  const doughnutBackground =
    revenueSlices.length > 0
      ? `conic-gradient(${revenueSlices
          .map(
            (source) =>
              `${source.color} ${source.start}% ${source.end}%`,
          )
          .join(", ")})`
      : "#e8eef5";

  return (
    <div className="dashboard-layout">
      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="eyebrow">
              COUNCIL FINANCE
            </p>

            <h2>
              Revenue Overview
            </h2>

            <p className="date-range">
              Live Appwrite data
              &nbsp;•&nbsp;
              Updated{" "}
              {updatedTime}
            </p>
          </div>

          <div className="header-actions">
            <div
              className="avatar-stack"
              aria-label="Council finance team"
            >
              <span>RM</span>
              <span>TD</span>
              <span>NN</span>
              <span>+</span>
            </div>

            <button
              type="button"
              className="ghost-button"
              disabled={
                loading
              }
              onClick={() =>
                setRefreshKey(
                  (
                    current,
                  ) =>
                    current +
                    1,
                )
              }
            >
              {loading
                ? "Refreshing..."
                : "Refresh data"}
            </button>
          </div>
        </header>

        <section className="kpi-grid">
          {kpis.map(
            (item) => (
              <button
                type="button"
                className="kpi-card"
                key={
                  item.label
                }
                onClick={() =>
                  onNavigate(
                    item.destination,
                  )
                }
                aria-label={`View ${item.label.toLowerCase()} records`}
              >
                <span>
                  {item.label}
                </span>

                <strong>
                  {item.value}
                </strong>

                <small
                  className={
                    item.tone ===
                    "good"
                      ? "positive"
                      : "neutral"
                  }
                >
                  <Database
                    size={13}
                  />

                  {item.meta}
                </small>
              </button>
            ),
          )}
        </section>

        <div className="dashboard-chart-grid">
          <section className="chart-panel">
            <div className="section-title-row">
              <div>
                <h3>
                  Daily collections
                </h3>

                <p>
                  Completed payment
                  transactions for{" "}
                  {data.periodLabel}
                  {" "}•{" "}
                  {collectionDaysRecorded} collection{" "}
                  {collectionDaysRecorded === 1
                    ? "day"
                    : "days"} recorded
                </p>
              </div>

              <span className="total-chip">
                {money.format(
                  data.currentMonthCollected,
                )}{" "}
                this month
              </span>
            </div>

            <BarChart
              values={
                data.dailyCollections
              }
              labels={
                data.dailyLabels
              }
            />
          </section>

          <section className="chart-panel revenue-source-chart-card">
            <div className="section-title-row">
              <div>
                <h3>
                  Revenue by source
                </h3>

                <p>
                  Share of collected revenue
                </p>
              </div>
            </div>

            <div className="revenue-source-chart">
              {revenueSlices.length >
              0 ? (
                <>
                  <div
                    className="revenue-doughnut"
                    style={{
                      background: doughnutBackground,
                    }}
                    role="img"
                    aria-label="Revenue distribution by source"
                  >
                    <div className="revenue-doughnut__center">
                      <strong>
                        {money.format(revenueSourceTotal)}
                      </strong>
                      <span>collected</span>
                    </div>
                  </div>

                  <div className="revenue-doughnut-legend">
                    {revenueSlices.map((source) => (
                      <div
                        className="revenue-doughnut-legend__row"
                        key={source.id}
                      >
                        <i
                          style={{
                            background: source.color,
                          }}
                        />
                        <span>{source.label}</span>
                        <strong>
                          {Math.round(source.share)}%
                        </strong>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="empty-chart-message">
                  No revenue-source data is available yet.
                </p>
              )}
            </div>
          </section>
        </div>

        <section className="transaction-section">
          <div className="transaction-group-title">
            <h3>
              Recent payments
            </h3>

            <span>
              {
                data.transactions
                  .length
              }{" "}
              shown
            </span>
          </div>

          {groups.length ===
          0 ? (
            <div className="transaction-group">
              <p>
                No completed
                payments have been
                recorded.
              </p>
            </div>
          ) : (
            groups.map(
              (group) => (
                <div
                  className="transaction-group"
                  key={
                    group
                  }
                >
                  <div className="transaction-group-title">
                    <h3>
                      {group}
                    </h3>

                    <span>
                      •••
                    </span>
                  </div>

                  {data.transactions
                    .filter(
                      (
                        transaction,
                      ) =>
                        transaction.dateGroup ===
                        group,
                    )
                    .map(
                      (
                        transaction,
                      ) => {
                        const Icon =
                          categoryIcons[
                            transaction
                              .category
                          ] ??
                          BadgeDollarSign;

                        return (
                          <article
                            className="transaction-row"
                            key={
                              transaction.id
                            }
                          >
                            <div className="transaction-icon">
                              <Icon
                                size={
                                  19
                                }
                              />
                            </div>

                            <div className="transaction-main">
                              <strong>
                                {
                                  transaction.category
                                }
                              </strong>

                              <span>
                                {
                                  transaction.time
                                }
                                &nbsp;•&nbsp;
                                {
                                  transaction.resident
                                }
                                &nbsp;•&nbsp;
                                {
                                  transaction.method
                                }
                              </span>
                            </div>

                            <div className="transaction-meta">
                              <strong>
                                +
                                {money.format(
                                  transaction.amount,
                                )}
                              </strong>

                              <span>
                                {
                                  transaction.ward
                                }
                              </span>
                            </div>
                          </article>
                        );
                      },
                    )}
                </div>
              ),
            )
          )}
        </section>
      </main>

      <aside className="analytics-panel">
        <section>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">
                REVENUE MIX
              </p>

              <h3>
                Where revenue
                comes from
              </h3>
            </div>
          </div>

          <div className="stats-list">
            {data
              .revenueSources
              .length >
            0 ? (
              data.revenueSources.map(
                (
                  source,
                ) => (
                  <StatBar
                    key={
                      source.id
                    }
                    label={
                      source.label
                    }
                    amount={money.format(
                      source.amount,
                    )}
                    progress={
                      source.progress
                    }
                  />
                ),
              )
            ) : (
              <p>
                No completed
                revenue payments
                recorded yet.
              </p>
            )}
          </div>
        </section>

        <section className="ai-tip-card">
          <div className="ai-tip-icon">
            <Lightbulb
              size={27}
            />
          </div>

          <p className="eyebrow">
            AI DECISION INSIGHT
          </p>

          {data.aiInsight ? (
            <>
              <h3>
                {
                  data.aiInsight
                    .title
                }
              </h3>

              <p>
                {
                  data.aiInsight
                    .summary
                }
              </p>

              <button
                type="button"
              >
                {
                  data.aiInsight
                    .recommendation
                }
              </button>
            </>
          ) : (
            <>
              <h3>
                No active
                insights
              </h3>

              <p>
                No AI insight
                records are
                currently available.
              </p>
            </>
          )}
        </section>
      </aside>
    </div>
  );
}
