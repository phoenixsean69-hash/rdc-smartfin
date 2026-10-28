const { randomUUID } = require("node:crypto");
const { Client, TablesDB, ID, Query } = require("node-appwrite");
const { processFlowSubmission } = require("./flowProcessor");

const allowedJourneys = {
  complaint: ["category", "location", "description"],
  application: ["permit_type", "area", "details"]
};

function getDatabases() {
  const endpoint = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
  const projectId = process.env.APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!projectId || !apiKey) {
    throw new Error("Appwrite server credentials are not configured");
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  return new TablesDB(client);
}

async function persistServiceRequest(raw) {
  const validation = processFlowSubmission(raw);

  if (validation.status !== 200) {
    return validation;
  }

  const input = typeof raw === "string" ? JSON.parse(raw) : raw;
  const data = input.flowResponse || input;
  const journey = data.journey;
  const selectedFields = allowedJourneys[journey];

  if (!selectedFields) {
    return {
      status: 422,
      error: "This journey is not enabled for database persistence"
    };
  }

  const payload = {};

  for (const field of selectedFields) {
    payload[field] = data[field].trim();
  }

  const requestReference = "RDC-" + randomUUID();
  const serviceCategory = journey === "complaint"
    ? payload.category
    : payload.permit_type;

  const databases = getDatabases();

  const saved = await databases.createRow({
    databaseId: "smartpay-db",
    tableId: "service_requests",
    rowId: ID.unique(),
    data: {
      requestReference,
      journey,
      status: "PENDING_REVIEW",
      serviceCategory: serviceCategory.slice(0, 50),
      payloadJson: JSON.stringify(payload)
    },
    permissions: []
  });

  return {
    status: 201,
    result: {
      accepted: true,
      simulation: false,
      requestId: saved.$id,
      requestReference: saved.requestReference,
      journey: saved.journey,
      executionStatus: "SAVED_PENDING_REVIEW"
    }
  };
}

async function getServiceRequestStatus(reference) {
  if (typeof reference !== "string" ||
      !/^RDC-[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(reference)) {
    return { status: 400, error: "Invalid request reference" };
  }

  const databases = getDatabases();

  const response = await databases.listRows({
    databaseId: "smartpay-db",
    tableId: "service_requests",
    queries: [
      Query.equal("requestReference", reference),
      Query.limit(1),
      Query.select([
        "requestReference",
        "journey",
        "status",
        "serviceCategory"
      ])
    ]
  });

  const row = response.rows[0];

  if (!row) {
    return { status: 404, error: "Request not found" };
  }

  return {
    status: 200,
    result: {
      requestReference: row.requestReference,
      journey: row.journey,
      status: row.status,
      serviceCategory: row.serviceCategory
    }
  };
}

module.exports = { persistServiceRequest, getServiceRequestStatus };
