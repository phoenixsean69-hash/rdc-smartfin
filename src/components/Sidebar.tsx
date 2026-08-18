import type { ComponentType } from "react";
import {
  BarChart3,
  Bot,
  CreditCard,
  FileBarChart,
  Gauge,
  Landmark,
  MessageSquareText,
  ReceiptText,
  Settings,
  Users,
  WalletCards,
} from "lucide-react";
import type { SectionId } from "../types";

interface SidebarProps {
  active: SectionId;
  onChange: (section: SectionId) => void;
}

const items: Array<{
  id: SectionId;
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
}> = [
  { id: "dashboard", label: "Dashboard", icon: Gauge },
  { id: "revenue", label: "Revenue", icon: Landmark },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "budgets", label: "Budgets", icon: WalletCards },
  { id: "expenditure", label: "Expenditure", icon: ReceiptText },
  { id: "residents", label: "Residents", icon: Users },
  { id: "sms", label: "SMS Automation", icon: MessageSquareText },
  { id: "ai", label: "AI Insights", icon: Bot },
  { id: "reports", label: "Reports", icon: FileBarChart },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="council-profile">
        <div className="council-mark">
          <BarChart3 size={27} strokeWidth={2.2} />
          <span className="notification-dot">4</span>
        </div>
        <div>
          <h1>Smart District</h1>
          <p>Council Finance Portal</p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Council navigation">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            className={`nav-item ${active === id ? "active" : ""}`}
            onClick={() => onChange(id)}
          >
            <Icon size={19} strokeWidth={2.2} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="admin-avatar">FA</div>
        <div>
          <strong>Finance Admin</strong>
          <span>Demo Rural District Council</span>
        </div>
      </div>
    </aside>
  );
}
