import type { ComponentType } from "react";
import {
  ArrowUpRight,
  BadgeDollarSign,
  Building2,
  CircleDollarSign,
  Lightbulb,
  Receipt,
  Store,
  Trash2,
} from "lucide-react";
import BarChart from "../components/BarChart";
import StatBar from "../components/StatBar";
import { kpis, monthlyRevenue, revenueSources, transactions } from "../data/mockData";

const categoryIcons: Record<string, ComponentType<{ size?: number }>> = {
  "Property Rates": Building2,
  "Business Licence": Store,
  "Refuse Collection": Trash2,
  "Market Fees": Receipt,
  "Development Levy": CircleDollarSign,
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

export default function DashboardPage() {
  const groups = ["Today", "Yesterday"];

  return (
    <div className="dashboard-layout">
      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="eyebrow">COUNCIL FINANCE</p>
            <h2>Revenue Overview</h2>
            <p className="date-range">01 - 17 August, 2026</p>
          </div>
          <div className="header-actions">
            <div className="avatar-stack" aria-label="Finance team">
              <span>TM</span><span>RC</span><span>SN</span><span>+</span>
            </div>
            <button type="button" className="ghost-button">Export report</button>
          </div>
        </header>

        <section className="kpi-grid">
          {kpis.map((item) => (
            <article className="kpi-card" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small className={item.tone === "good" ? "positive" : "neutral"}>
                <ArrowUpRight size={13} /> {item.change} vs last month
              </small>
            </article>
          ))}
        </section>

        <section className="chart-panel">
          <div className="section-title-row">
            <div>
              <h3>Daily collections</h3>
              <p>Recorded revenue across all payment channels</p>
            </div>
            <span className="total-chip">$184,620 total</span>
          </div>
          <BarChart values={monthlyRevenue} />
        </section>

        <section className="transaction-section">
          {groups.map((group) => (
            <div className="transaction-group" key={group}>
              <div className="transaction-group-title">
                <h3>{group}</h3>
                <span>•••</span>
              </div>
              {transactions
                .filter((transaction) => transaction.dateGroup === group)
                .map((transaction) => {
                  const Icon = categoryIcons[transaction.category] ?? BadgeDollarSign;
                  return (
                    <article className="transaction-row" key={transaction.id}>
                      <div className="transaction-icon"><Icon size={19} /></div>
                      <div className="transaction-main">
                        <strong>{transaction.category}</strong>
                        <span>
                          {transaction.time} &nbsp;•&nbsp; {transaction.resident} &nbsp;•&nbsp; {transaction.method}
                        </span>
                      </div>
                      <div className="transaction-meta">
                        <strong>+{money.format(transaction.amount)}</strong>
                        <span>{transaction.ward}</span>
                      </div>
                    </article>
                  );
                })}
            </div>
          ))}
        </section>
      </main>

      <aside className="analytics-panel">
        <section>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">REVENUE MIX</p>
              <h3>Where revenue comes from</h3>
            </div>
          </div>
          <div className="stats-list">
            {revenueSources.map((source) => (
              <StatBar
                key={source.label}
                label={source.label}
                amount={money.format(source.amount)}
                progress={source.progress}
              />
            ))}
          </div>
        </section>

        <section className="ai-tip-card">
          <div className="ai-tip-icon"><Lightbulb size={27} /></div>
          <p className="eyebrow">AI REVENUE INSIGHT</p>
          <h3>Recover more from Ward 4</h3>
          <p>
            Property-rate collections are 18% below the four-week trend. 46 accounts hold most of the outstanding amount.
          </p>
          <button type="button">VIEW RECOMMENDATION</button>
        </section>
      </aside>
    </div>
  );
}
