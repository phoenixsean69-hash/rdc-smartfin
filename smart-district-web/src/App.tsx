import { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import ModulePage from "./pages/ModulePage";
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
          ) : (
            <ModulePage section={activeSection} />
          )}
        </section>
      </div>
    </div>
  );
}
