const { randomUUID } = require("node:crypto");

const billingServices = new Set([
  "water", "rates", "refuse", "market",
  "land", "licence", "rental", "levy"
]);

const fields = {
  billing: ["service", "account_reference", "request_type"],
  complaint: ["category", "location", "description"],
  application: ["permit_type", "area", "details"],
  appointment: ["department", "preferred_date", "reason"],
  human_support: ["department", "reason"],
  documents: ["document_type", "account_reference"],
  updates: ["topic", "preference"],
  tracking: ["request_category", "request_reference"]
};

const actions = {
  billing: "VERIFY_RESIDENT_AND_LOOKUP_BILL",
  complaint: "CREATE_COMPLAINT_TICKET",
  application: "CREATE_APPLICATION_ENQUIRY",
  appointment: "CHECK_AVAILABILITY",
  human_support: "REQUEST_OFFICER_HANDOFF",
  documents: "VERIFY_AND_RETRIEVE_DOCUMENT",
  updates: "MANAGE_NOTIFICATION_CONSENT",
  tracking: "VERIFY_AND_LOOKUP_REQUEST"
};

function processFlowSubmission(raw) {
  // Accept either direct test data or a Twilio-style Flow response.
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return { status: 400, error: "Invalid JSON" };
    }
  }

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { status: 400, error: "Invalid submission" };
  }

  const data = raw.flowResponse || raw;
  const journey = data.journey;

  if (!Object.hasOwn(fields, journey)) {
    return { status: 400, error: "Unknown service journey" };
  }

  for (const key of fields[journey]) {
    const value = data[key];

    if (typeof value !== "string" ||
        !value.trim() ||
        value.length > 1000) {
      return {
        status: 422,
        error: `Invalid or missing field: ${key}`
      };
    }
  }

  if (journey === "billing") {
    if (!billingServices.has(data.service)) {
      return { status: 422, error: "Unknown billing service" };
    }

    if (!["balance", "payment", "statement"].includes(data.request_type)) {
      return { status: 422, error: "Invalid billing request" };
    }
  }

  if (journey === "appointment") {
    const date = data.preferred_date;
    const parsed = new Date(date + "T00:00:00Z");

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== date) {
      return { status: 422, error: "Invalid appointment date" };
    }
  }

  if (journey === "updates" &&
      !["yes", "no"].includes(data.preference)) {
    return { status: 422, error: "Invalid update preference" };
  }

  // Demonstration acknowledgement only.
  // No account verification, money movement or database writes.
  return {
    status: 200,
    result: {
      accepted: true,
      simulation: true,
      requestId: "DEMO-" + randomUUID(),
      journey,
      service: journey === "billing" ? data.service : undefined,
      nextAction: actions[journey],
      executionStatus: "NOT_CONNECTED",
      message: "Form accepted for local testing only."
    }
  };
}

module.exports = { processFlowSubmission };
