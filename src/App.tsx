import { useState } from "react";

import { useAuth } from "./auth/AuthContext";
import {
  useCallback,
  useEffect,
} from "react";

import Sidebar from "./components/Sidebar";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ModulePage from "./pages/ModulePage";
import SmsAutomationPage from "./pages/SmsAutomationPage";

import type { SectionId } from "./types";

const sectionIds: SectionId[] = [
  "dashboard",
  "revenue",
  "payments",
  "budgets",
  "expenditure",
  "residents",
  "sms",
  "ai",
  "reports",
  "settings",
];

function sectionFromLocation(): SectionId {
  const section = window.location.hash.slice(1) as SectionId;

  return sectionIds.includes(section)
    ? section
    : "dashboard";
}

export default function App() {
  const {
    staff,
    loading,
    logout,
  } = useAuth();

  const [
    activeSection,
    setActiveSection,
  ] = useState<SectionId>(
    sectionFromLocation,
  );

  const navigate = useCallback(
    (section: SectionId) => {
      if (section === activeSection) {
        return;
      }

      const hash =
        section === "dashboard"
          ? ""
          : `#${section}`;

      window.history.pushState(
        { section },
        "",
        `${window.location.pathname}${window.location.search}${hash}`,
      );
      setActiveSection(section);
    },
    [activeSection],
  );

  useEffect(() => {
    const restoreSection = () => {
      setActiveSection(
        sectionFromLocation(),
      );
    };

    window.addEventListener(
      "popstate",
      restoreSection,
    );

    return () => {
      window.removeEventListener(
        "popstate",
        restoreSection,
      );
    };
  }, []);

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-mark">
          SP
        </div>

        <strong>
          Loading SmartPay
        </strong>

        <span>
          Securing council session...
        </span>
      </div>
    );
  }

  if (!staff) {
    return <LoginPage />;
  }

  return (
    <div className="app-viewport">
      <div className="dashboard-shell">
        <Sidebar
          active={activeSection}
          onChange={navigate}
          staff={staff}
          onLogout={() => {
            void logout();
          }}
        />

        <section className="content-shell">
          <div hidden={activeSection !== "dashboard"}>
            <DashboardPage
              onNavigate={navigate}
            />
          </div>

          {activeSection === "dashboard" ? null : activeSection ===
            "sms" ? (
            <SmsAutomationPage />
          ) : (
            <ModulePage
              section={activeSection}
            />
          )}
        </section>
      </div>
    </div>
  );
}
