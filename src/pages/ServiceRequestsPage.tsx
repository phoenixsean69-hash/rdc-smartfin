import { useCallback, useEffect, useState } from "react";
import { account } from "../lib/appwrite";
import { useAuth } from "../auth/AuthContext";

type ServiceRequest = {
  id: string;
  reference: string;
  journey: string;
  status: string;
  category: string;
  assignedDepartmentId?: string | null;
};

type AuditEvent = {
  action: string;
  actorRole: string;
  description: string;
  eventTime: string;
  metadata?: string;
};

const departments = [
  ["dept-finance", "Finance"],
  ["dept-revenue", "Revenue"],
  ["dept-admin", "Administration"],
  ["dept-works", "Public Works"],
  ["dept-health", "Health Services"],
  ["dept-environment", "Environment"]
];

const fieldStyle = {
  width: "100%",
  padding: "11px",
  marginTop: "7px",
  border: "1px solid #dfe3e9",
  borderRadius: "9px",
  background: "#fff"
};

async function staffApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const { jwt } = await account.createJWT();

  const response = await fetch("/api/dev/staff" + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  return data as T;
}

function getError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export default function ServiceRequestsPage() {
  const { staff } = useAuth();

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedRef, setSelectedRef] = useState("");
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [departmentId, setDepartmentId] = useState("dept-admin");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const selected = requests.find(
    request => request.reference === selectedRef
  );

  const manager =
    staff?.role === "finance_manager" ||
    staff?.role === "administrator";

  const canProcess =
    manager ||
    (
      staff?.role === "department_head" &&
      Boolean(staff?.departmentId) &&
      staff?.departmentId === selected?.assignedDepartmentId
    );

  const refresh = useCallback(async () => {
    try {
      const data = await staffApi<{ requests: ServiceRequest[] }>(
        "/service-requests"
      );

      setRequests(data.requests);

      setSelectedRef(current =>
        data.requests.some(row => row.reference === current)
          ? current
          : data.requests[0]?.reference || ""
      );

      setError("");
    } catch (err) {
      setError(getError(err));
    }
  }, []);

  useEffect(() => {
    void refresh();

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    }, 5000);

    return () => window.clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    if (!selectedRef) {
      setEvents([]);
      return;
    }

    let cancelled = false;

    void staffApi<{ events: AuditEvent[] }>(
      `/service-requests/${encodeURIComponent(selectedRef)}/audit`
    ).then(data => {
      if (!cancelled) setEvents(data.events);
    }).catch(err => {
      if (!cancelled) setError(getError(err));
    });

    return () => {
      cancelled = true;
    };
  }, [selectedRef]);

  async function runAction(
    action: "assign" | "start" | "resolve" | "reject"
  ) {
    if (!selected || busy) return;

    setError("");
    setMessage("");

    if (
      (action === "resolve" || action === "reject") &&
      reason.trim().length < 5
    ) {
      setError("Enter a reason of at least five characters.");
      return;
    }

    setBusy(true);

    try {
      const result = await staffApi<{ status: string }>(
        `/service-requests/${encodeURIComponent(selected.reference)}/action`,
        {
          method: "POST",
          body: JSON.stringify({
            action,
            departmentId:
              action === "assign" ? departmentId : undefined,
            reason: reason.trim()
          })
        }
      );

      setRequests(previous =>
        previous.map(row =>
          row.reference === selected.reference
            ? {
                ...row,
                status: result.status,
                assignedDepartmentId:
                  action === "assign"
                    ? departmentId
                    : row.assignedDepartmentId
              }
            : row
        )
      );

      setMessage(`Request updated to ${result.status}.`);
      setReason("");

      await refresh();

      const audit = await staffApi<{ events: AuditEvent[] }>(
        `/service-requests/${encodeURIComponent(selected.reference)}/audit`
      );

      setEvents(audit.events);
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  }

  async function createTestRequest() {
    if (busy) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/dev/service-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          journey: "complaint",
          category: "TEST-WORKFLOW",
          location: "TEST-ONLY",
          description: "TEST ONLY - not a real resident complaint"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Test request failed");
      }

      await refresh();
      setSelectedRef(data.requestReference);
      setMessage(`Test request created: ${data.requestReference}`);
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="module-page">
      <header className="module-header">
        <div>
          <p className="eyebrow">COUNCIL OPERATIONS</p>
          <h2>Service Requests</h2>
          <p>
            Manage complaints, applications, departments
            and staff processing.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          disabled={busy}
          onClick={() => void refresh()}
        >
          Refresh
        </button>
      </header>

      {error && (
        <p role="alert" style={{ color: "#b42318", marginTop: 20 }}>
          {error}
        </p>
      )}

      {message && (
        <p role="status" style={{ color: "#187450", marginTop: 20 }}>
          {message}
        </p>
      )}

      <div style={{
        display: "flex",
        gap: 12,
        marginTop: 24,
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        <span className="total-chip">
          {requests.length} requests
        </span>

        <span className="total-chip">
          Role: {staff?.role}
        </span>

        <button
          type="button"
          className="ghost-button"
          disabled={busy}
          onClick={() => void createTestRequest()}
        >
          Create TEST complaint
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
        gap: 18,
        marginTop: 24,
        alignItems: "start"
      }}>
        <section className="data-card">
          <div className="card-heading">
            <h3>Request Queue</h3>
            <span>Appwrite records</span>
          </div>

          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {requests.map(row => (
                  <tr key={row.id}>
                    <td>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => setSelectedRef(row.reference)}
                      >
                        {row.reference.slice(0, 18)}...
                      </button>
                    </td>

                    <td>{row.category || row.journey}</td>
                    <td><strong>{row.status}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {requests.length === 0 && (
            <p>No requests available.</p>
          )}
        </section>

        <section className="data-card">
          <div className="card-heading">
            <h3>Request Management</h3>
            <span>Staff controls</span>
          </div>

          {!selected ? (
            <p>Select a request from the queue.</p>
          ) : (
            <div style={{
              display: "grid",
              gap: 16,
              marginTop: 18
            }}>
              <div>
                <small>Request Reference</small>

                <p style={{ overflowWrap: "anywhere" }}>
                  <strong>{selected.reference}</strong>
                </p>

                <p>
                  Status: <strong>{selected.status}</strong>
                </p>

                <p>
                  Department: {
                    selected.assignedDepartmentId || "Unassigned"
                  }
                </p>
              </div>

              <label>
                Department

                <select
                  value={departmentId}
                  onChange={event =>
                    setDepartmentId(event.target.value)
                  }
                  disabled={busy}
                  style={fieldStyle}
                >
                  {departments.map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Action Reason

                <textarea
                  value={reason}
                  onChange={event =>
                    setReason(event.target.value)
                  }
                  rows={3}
                  maxLength={300}
                  disabled={busy}
                  style={fieldStyle}
                  placeholder="Required for resolution or rejection"
                />
              </label>

              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10
              }}>
                {selected.status === "PENDING_REVIEW" && manager && (
                  <button
                    type="button"
                    className="primary-button"
                    disabled={busy}
                    onClick={() => void runAction("assign")}
                  >
                    Assign
                  </button>
                )}

                {selected.status === "ASSIGNED" && canProcess && (
                  <button
                    type="button"
                    className="primary-button"
                    disabled={busy}
                    onClick={() => void runAction("start")}
                  >
                    Start Work
                  </button>
                )}

                {selected.status === "IN_PROGRESS" && canProcess && (
                  <>
                    <button
                      type="button"
                      className="primary-button"
                      disabled={busy}
                      onClick={() => void runAction("resolve")}
                    >
                      Resolve
                    </button>

                    <button
                      type="button"
                      className="ghost-button"
                      disabled={busy}
                      onClick={() => void runAction("reject")}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>

              {["RESOLVED", "REJECTED"].includes(selected.status) && (
                <p>This service request is closed.</p>
              )}

              <div>
                <h3>Audit History</h3>
                <small>Recent events preview</small>

                {events.map((event, index) => (
                  <div
                    key={`${event.eventTime}-${index}`}
                    style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #edf0f3"
                    }}
                  >
                    <strong>{event.action}</strong>
                    <p>{event.description}</p>
                    <small>
                      {event.actorRole} - {event.eventTime}
                    </small>
                  </div>
                ))}

                {events.length === 0 && (
                  <p>No audit events found.</p>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
