import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BellRing,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Plus,
  Send,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";
import { scheduledSms, smsAutomations, smsLogs } from "../data/mockData";
import type { SmsAutomationStatus } from "../types";

const iconByType = {
  billing: BellRing,
  payment: CheckCircle2,
  service: CalendarClock,
  emergency: AlertTriangle,
};

export default function SmsAutomationPage() {
  const [ruleStatus, setRuleStatus] = useState<Record<string, SmsAutomationStatus>>(
    () => Object.fromEntries(smsAutomations.map((item) => [item.id, item.status])),
  );
  const [audience, setAudience] = useState("All SMS-enabled residents");
  const [message, setMessage] = useState(
    "Reminder: Your council rates are due. Please check your Smart District account or use the available council payment channels.",
  );
  const [sent, setSent] = useState(false);

  const activeCount = useMemo(
    () => Object.values(ruleStatus).filter((status) => status === "Active").length,
    [ruleStatus],
  );

  const toggleRule = (id: string) => {
    setRuleStatus((current) => ({
      ...current,
      [id]: current[id] === "Active" ? "Paused" : "Active",
    }));
  };

  const sendDemo = () => {
    setSent(true);
    window.setTimeout(() => setSent(false), 2800);
  };

  return (
    <main className="module-page sms-page">
      <header className="module-header sms-header">
        <div>
          <p className="eyebrow">RESIDENT COMMUNICATION</p>
          <h2>SMS Automation</h2>
          <p>
            Schedule repetitive messages, broadcast council notices and automatically alert residents when important account or service events occur.
          </p>
        </div>
        <button className="primary-button" type="button">
          <Plus size={17} /> New automation
        </button>
      </header>

      <section className="sms-overview-grid" aria-label="SMS automation overview">
        <OverviewCard icon={Users} label="Residents" value="2,418" detail="Council accounts" />
        <OverviewCard icon={Smartphone} label="SMS enabled" value="2,301" detail="95.2% reachable" />
        <OverviewCard icon={Zap} label="Active automations" value={String(activeCount)} detail="Running rules" />
        <OverviewCard icon={MessageSquareText} label="Messages today" value="143" detail="139 delivered" />
      </section>

      <div className="sms-workspace">
        <div className="sms-primary-column">
          <section className="sms-section-card">
            <div className="sms-section-heading">
              <div>
                <p className="eyebrow">AUTOMATED MESSAGES</p>
                <h3>Resident alert rules</h3>
                <p>Rules automatically decide when repetitive SMS messages should be sent.</p>
              </div>
              <span className="section-count">{activeCount} active</span>
            </div>

            <div className="automation-list">
              {smsAutomations.map((item) => {
                const Icon = iconByType[item.type];
                const status = ruleStatus[item.id];
                return (
                  <article className="automation-row" key={item.id}>
                    <div className={`automation-icon ${item.type}`}>
                      <Icon size={19} />
                    </div>
                    <div className="automation-copy">
                      <div className="automation-title-line">
                        <strong>{item.name}</strong>
                        <span className={`automation-status ${status.toLowerCase()}`}>{status}</span>
                      </div>
                      <p>{item.description}</p>
                      <div className="automation-meta">
                        <span><Users size={13} /> {item.audience}</span>
                        <span><Clock3 size={13} /> {item.schedule}</span>
                        <span>Next: {item.nextRun}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`switch-control ${status === "Active" ? "on" : ""}`}
                      aria-label={`${status === "Active" ? "Pause" : "Activate"} ${item.name}`}
                      onClick={() => toggleRule(item.id)}
                    >
                      <span />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="sms-section-card">
            <div className="sms-section-heading compact-heading">
              <div>
                <p className="eyebrow">SCHEDULED</p>
                <h3>Upcoming messages</h3>
              </div>
              <button type="button" className="text-button">View calendar</button>
            </div>

            <div className="scheduled-list">
              {scheduledSms.map((item) => (
                <article className="scheduled-row" key={item.id}>
                  <div className="scheduled-date-icon"><CalendarClock size={18} /></div>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.audience}</span>
                  </div>
                  <div className="scheduled-meta">
                    <strong>{item.sendAt}</strong>
                    <span>{item.recipients.toLocaleString()} recipients</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="sms-section-card">
            <div className="sms-section-heading compact-heading">
              <div>
                <p className="eyebrow">DELIVERY LOG</p>
                <h3>Recent SMS activity</h3>
              </div>
              <span className="section-count">Static demo</span>
            </div>

            <div className="sms-log-table-wrap">
              <table className="sms-log-table">
                <thead>
                  <tr>
                    <th>Recipient</th>
                    <th>Message</th>
                    <th>Source</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {smsLogs.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.recipient}</strong></td>
                      <td>{item.subject}</td>
                      <td>{item.channel}</td>
                      <td>{item.time}</td>
                      <td><span className={`delivery-pill ${item.status.toLowerCase()}`}>{item.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="sms-secondary-column">
          <section className="broadcast-card">
            <div className="broadcast-icon"><Send size={21} /></div>
            <p className="eyebrow">QUICK BROADCAST</p>
            <h3>Send an SMS now</h3>
            <p className="broadcast-help">Compose a one-off council message for a resident group.</p>

            <label className="field-label">
              Audience
              <select value={audience} onChange={(event) => setAudience(event.target.value)}>
                <option>All SMS-enabled residents</option>
                <option>Residents with overdue balances</option>
                <option>Ward 1 residents</option>
                <option>Ward 2 residents</option>
                <option>Ward 3 residents</option>
                <option>Ward 4 residents</option>
              </select>
            </label>

            <label className="field-label">
              Message
              <textarea
                rows={7}
                maxLength={320}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </label>

            <div className="composer-footer">
              <span>{message.length}/320 characters</span>
              <span>{audience === "All SMS-enabled residents" ? "2,301 recipients" : "Selected group"}</span>
            </div>

            <button className="broadcast-send-button" type="button" onClick={sendDemo}>
              <Send size={16} /> Send demo SMS
            </button>
            {sent && <div className="demo-toast"><CheckCircle2 size={15} /> Demo SMS queued successfully</div>}
          </section>

          <section className="alert-engine-card">
            <div className="alert-engine-heading">
              <div className="alert-engine-icon"><BellRing size={20} /></div>
              <div>
                <p className="eyebrow">AUTO-ALARM</p>
                <h3>Resident alert engine</h3>
              </div>
            </div>
            <p>Automatically notify residents when these account conditions are detected.</p>

            <div className="trigger-list">
              <TriggerRow title="Due-date reminder" detail="1 day before bill due date" />
              <TriggerRow title="Overdue warning" detail="7 days after due date" />
              <TriggerRow title="Urgent debt alert" detail="30 days overdue" paused />
              <TriggerRow title="Payment receipt" detail="Immediately after payment" />
            </div>
          </section>

          <section className="delivery-health-card">
            <p className="eyebrow">DELIVERY HEALTH</p>
            <div className="delivery-health-main">
              <strong>96.8%</strong>
              <span>successful delivery</span>
            </div>
            <div className="delivery-health-track"><span style={{ width: "96.8%" }} /></div>
            <div className="delivery-health-stats">
              <span><b>139</b> Delivered</span>
              <span><b>12</b> Queued</span>
              <span><b>4</b> Failed</span>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function OverviewCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="sms-overview-card">
      <div className="sms-overview-icon"><Icon size={18} /></div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

function TriggerRow({ title, detail, paused = false }: { title: string; detail: string; paused?: boolean }) {
  return (
    <div className="trigger-row">
      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
      <span className={`mini-state ${paused ? "paused" : "active"}`}>{paused ? "Paused" : "Active"}</span>
    </div>
  );
}
