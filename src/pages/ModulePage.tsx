import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Download,
  FileText,
  MessageSquareText,
  Search,
  Sparkles,
} from "lucide-react";
import {
  aiInsights,
  budgetRows,
  expenditureRows,
  residents,
  revenueSources,
  transactions,
} from "../data/mockData";
import type { SectionId } from "../types";

type StandardSection = Exclude<SectionId, "dashboard" | "sms">;

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

const titles: Record<StandardSection, { title: string; description: string }> = {
  revenue: {
    title: "Revenue",
    description: "Track council revenue streams, targets and collection performance.",
  },
  payments: {
    title: "Payments",
    description: "Review payments received through mobile, USSD, card and council channels.",
  },
  budgets: {
    title: "Budgets",
    description: "Compare departmental allocations against current expenditure.",
  },
  expenditure: {
    title: "Expenditure",
    description: "Monitor council spending and identify unusual transactions.",
  },
  residents: {
    title: "Residents",
    description: "View resident accounts, properties, balances, payment status and SMS reachability.",
  },
  ai: {
    title: "AI Insights",
    description: "Static prototype of financial anomaly detection and decision support.",
  },
  reports: {
    title: "Reports",
    description: "Generate council finance summaries for management and accountability.",
  },
  settings: {
    title: "Settings",
    description: "Configure council profile and prototype finance preferences.",
  },
};

export default function ModulePage({ section }: { section: StandardSection }) {
  const meta = titles[section];

  return (
    <main className="module-page">
      <header className="module-header">
        <div>
          <p className="eyebrow">SMART DISTRICT</p>
          <h2>{meta.title}</h2>
          <p>{meta.description}</p>
        </div>
        <button className="primary-button" type="button">
          <Download size={17} /> Export
        </button>
      </header>

      {section === "revenue" && <RevenueModule />}
      {section === "payments" && <PaymentsModule />}
      {section === "budgets" && <BudgetsModule />}
      {section === "expenditure" && <ExpenditureModule />}
      {section === "residents" && <ResidentsModule />}
      {section === "ai" && <AiModule />}
      {section === "reports" && <ReportsModule />}
      {section === "settings" && <SettingsModule />}
    </main>
  );
}

function RevenueModule() {
  return (
    <div className="module-grid two-column">
      <section className="data-card wide-card">
        <div className="card-heading">
          <h3>Revenue by source</h3>
          <span>August 2026</span>
        </div>
        <div className="table-list">
          {revenueSources.map((source) => (
            <div className="table-row" key={source.label}>
              <div>
                <strong>{source.label}</strong>
                <span>{source.progress}% of target</span>
              </div>
              <strong>{money.format(source.amount)}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="data-card">
        <div className="metric-big">
          <span>Target achievement</span>
          <strong>68.7%</strong>
          <small>+$21,340 needed to reach this month's target</small>
        </div>
      </section>
    </div>
  );
}

function PaymentsModule() {
  return (
    <section className="data-card">
      <div className="card-heading">
        <h3>Recent payments</h3>
        <span>{transactions.length} static records</span>
      </div>
      <div className="responsive-table">
        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Resident</th>
              <th>Category</th>
              <th>Channel</th>
              <th>Ward</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((row) => (
              <tr key={row.id}>
                <td>{row.reference}</td>
                <td>{row.resident}</td>
                <td>{row.category}</td>
                <td>{row.method}</td>
                <td>{row.ward}</td>
                <td><strong>{money.format(row.amount)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BudgetsModule() {
  return (
    <section className="data-card">
      <div className="card-heading">
        <h3>Department budgets</h3>
        <span>2026 financial year</span>
      </div>
      <div className="budget-list">
        {budgetRows.map((row) => {
          const percent = Math.round((row.spent / row.allocated) * 100);
          return (
            <div className="budget-row" key={row.department}>
              <div className="budget-label">
                <strong>{row.department}</strong>
                <span>{money.format(row.spent)} of {money.format(row.allocated)}</span>
              </div>
              <div className="progress-track"><span style={{ width: `${percent}%` }} /></div>
              <b>{percent}%</b>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ExpenditureModule() {
  return (
    <section className="data-card">
      <div className="card-heading">
        <h3>Latest expenditure</h3>
        <span>Static records</span>
      </div>
      <div className="responsive-table">
        <table>
          <thead>
            <tr><th>Description</th><th>Department</th><th>Date</th><th>Amount</th></tr>
          </thead>
          <tbody>
            {expenditureRows.map((row) => (
              <tr key={`${row.description}-${row.date}`}>
                <td>{row.description}</td>
                <td>{row.department}</td>
                <td>{row.date}</td>
                <td><strong>{money.format(row.amount)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ResidentsModule() {
  return (
    <section className="data-card">
      <div className="card-heading with-search">
        <div>
          <h3>Resident accounts</h3>
          <span>{residents.length} demo accounts</span>
        </div>
        <label className="search-box">
          <Search size={16} />
          <input placeholder="Search residents" />
        </label>
      </div>
      <div className="responsive-table">
        <table className="resident-table">
          <thead>
            <tr>
              <th>Resident</th>
              <th>Property</th>
              <th>Ward</th>
              <th>Phone</th>
              <th>Balance</th>
              <th>Status</th>
              <th>SMS</th>
              <th>Last SMS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {residents.map((resident) => (
              <tr key={resident.id}>
                <td><strong>{resident.name}</strong></td>
                <td>{resident.propertyRef}</td>
                <td>{resident.ward}</td>
                <td>{resident.phone}</td>
                <td>{money.format(resident.balance)}</td>
                <td><span className={`status-pill ${resident.status.toLowerCase()}`}>{resident.status}</span></td>
                <td>
                  <span className={`sms-state-pill ${resident.smsEnabled ? "enabled" : "disabled"}`}>
                    {resident.smsEnabled ? "Enabled" : "Disabled"}
                  </span>
                </td>
                <td>
                  <span className="last-sms-cell">{resident.lastSms}</span>
                  <small>{resident.smsCount} this month</small>
                </td>
                <td>
                  <button type="button" className="icon-action-button" aria-label={`Send SMS to ${resident.name}`}>
                    <MessageSquareText size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AiModule() {
  return (
    <div className="insights-grid">
      {aiInsights.map((insight) => (
        <article className={`insight-card ${insight.severity}`} key={insight.title}>
          <div className="insight-top">
            <span>
              {insight.severity === "positive" ? (
                <CheckCircle2 size={20} />
              ) : insight.severity === "high" ? (
                <AlertTriangle size={20} />
              ) : (
                <Bot size={20} />
              )}
            </span>
            <small>{insight.severity.toUpperCase()}</small>
          </div>
          <h3>{insight.title}</h3>
          <p>{insight.body}</p>
          <div className="recommendation"><Sparkles size={16} /><span>{insight.action}</span></div>
        </article>
      ))}
    </div>
  );
}

function ReportsModule() {
  const reports = [
    "Monthly revenue summary",
    "Outstanding debtors report",
    "Budget vs expenditure",
    "Revenue by ward",
    "Payment-channel summary",
    "Anomaly review report",
  ];

  return (
    <div className="reports-grid">
      {reports.map((report) => (
        <button type="button" className="report-card" key={report}>
          <FileText size={24} />
          <span>
            <strong>{report}</strong>
            <small>Generate from current static demo data</small>
          </span>
          <Download size={17} />
        </button>
      ))}
    </div>
  );
}

function SettingsModule() {
  return (
    <div className="settings-grid">
      <section className="data-card">
        <div className="card-heading"><h3>Council profile</h3><span>Demo settings</span></div>
        <div className="form-grid">
          <label>Council name<input defaultValue="Demo Rural District Council" /></label>
          <label>Finance year<input defaultValue="2026" /></label>
          <label>Currency<input defaultValue="USD" /></label>
          <label>Default collection target<input defaultValue="$268,000" /></label>
        </div>
        <button type="button" className="primary-button">Save prototype settings</button>
      </section>
      <section className="data-card">
        <div className="card-heading"><h3>Data mode</h3><span>Prototype</span></div>
        <div className="static-mode">
          <span className="static-dot" />
          <div>
            <strong>Static demo data enabled</strong>
            <p>No backend, payment gateway, live SMS provider or council records are connected yet.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
