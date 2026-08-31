import type {
  ComponentType,
} from "react";

import {
  BarChart3,
  Bot,
  CreditCard,
  FileBarChart,
  Gauge,
  Landmark,
  LogOut,
  MessageSquareText,
  ReceiptText,
  Settings,
  Users,
  WalletCards,
} from "lucide-react";

import type {
  CouncilStaff,
} from "../auth/AuthContext";

import type {
  SectionId,
} from "../types";

interface SidebarProps {
  active: SectionId;
  onChange: (
    section: SectionId,
  ) => void;

  staff: CouncilStaff;
  onLogout: () => void;
}

const items: Array<{
  id: SectionId;
  label: string;
  icon: ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
}> = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Gauge,
  },
  {
    id: "revenue",
    label: "Revenue",
    icon: Landmark,
  },
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
  },
  {
    id: "budgets",
    label: "Budgets",
    icon: WalletCards,
  },
  {
    id: "expenditure",
    label: "Expenditure",
    icon: ReceiptText,
  },
  {
    id: "residents",
    label: "Residents",
    icon: Users,
  },
  {
    id: "sms",
    label: "SMS Automation",
    icon: MessageSquareText,
  },
  {
    id: "ai",
    label: "AI Insights",
    icon: Bot,
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileBarChart,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];

function formatRole(
  role: string,
) {
  return role
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

export default function Sidebar({
  active,
  onChange,
  staff,
  onLogout,
}: SidebarProps) {
  const initials =
    `${staff.firstName[0] ?? ""}${
      staff.lastName[0] ?? ""
    }`.toUpperCase();

  return (
    <aside className="sidebar">
      <div className="council-profile">
        <div className="council-mark">
          <BarChart3
            size={27}
            strokeWidth={2.2}
          />

          <span className="notification-dot">
            4
          </span>
        </div>

        <div>
          <h1>SmartPay</h1>

          <p>
            Council Finance Portal
          </p>
        </div>
      </div>

      <nav
        className="sidebar-nav"
        aria-label="Council navigation"
      >
        {items.map(
          ({
            id,
            label,
            icon: Icon,
          }) => (
            <button
              type="button"
              key={id}
              className={`nav-item ${
                active === id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                onChange(id)
              }
            >
              <Icon
                size={19}
                strokeWidth={2.2}
              />

              <span>
                {label}
              </span>
            </button>
          ),
        )}
      </nav>

      <div className="sidebar-footer auth-sidebar-footer">
        <div className="admin-avatar">
          {initials}
        </div>

        <div className="sidebar-user-copy">
          <strong>
            {staff.firstName}{" "}
            {staff.lastName}
          </strong>

          <span>
            {formatRole(
              staff.role,
            )}
          </span>
        </div>

        <button
          type="button"
          className="sidebar-logout"
          onClick={onLogout}
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
}
