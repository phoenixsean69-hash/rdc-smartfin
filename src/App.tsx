import { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import ModulePage from "./pages/ModulePage";
import SmsAutomationPage from "./pages/SmsAutomationPage";
import type { SectionId } from "./types";

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");

  return (
    <div className="app-viewport">
      <div className="dashboard-shell">
        <Sidebar active={activeSection} onChange={setActiveSection} />
        <section className="content-shell">
          {activeSection === "dashboard" ? (
            <DashboardPage />
          ) : activeSection === "sms" ? (
            <SmsAutomationPage />
          ) : (
            <ModulePage section={activeSection} />
          )}
        </section>
      </div>
    </div>
  );
}
