const { Client, Account, TablesDB, ID, Query } = require("node-appwrite");

const DB = "smartpay-db";
const MANAGERS = new Set(["administrator", "finance_manager"]);
const REF = /^RDC-[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

const ACTIONS = {
  assign: { from: "PENDING_REVIEW", to: "ASSIGNED" },
  start: { from: "ASSIGNED", to: "IN_PROGRESS" },
  resolve: { from: "IN_PROGRESS", to: "RESOLVED" },
  reject: { from: "IN_PROGRESS", to: "REJECTED" }
};

function fail(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

function makeClient(jwt) {
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const project = process.env.APPWRITE_PROJECT_ID;

  if (!endpoint || !project) {
    throw new Error("Appwrite server configuration missing");
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project);

  if (jwt) {
    client.setJWT(jwt);
  } else {
    if (!process.env.APPWRITE_API_KEY) {
      throw new Error("Appwrite server key missing");
    }
    client.setKey(process.env.APPWRITE_API_KEY);
  }

  return client;
}

async function authenticateStaff(jwt) {
  const client = makeClient(jwt);
  const user = await new Account(client).get();
  const db = new TablesDB(client);

  const result = await db.listRows({
    databaseId: DB,
    tableId: "council_staff",
    queries: [
      Query.equal("userId", user.$id),
      Query.limit(1)
    ]
  });

  const staff = result.rows[0];

  if (!staff || staff.status !== "active") {
    fail(403, "Active council staff access required");
  }

  return { user, staff };
}

async function findRequest(db, reference) {
  if (typeof reference !== "string" || !REF.test(reference)) {
    fail(400, "Invalid request reference");
  }

  const result = await db.listRows({
    databaseId: DB,
    tableId: "service_requests",
    queries: [
      Query.equal("requestReference", reference),
      Query.limit(1)
    ]
  });

  if (!result.rows.length) {
    fail(404, "Service request not found");
  }

  return result.rows[0];
}

async function transitionServiceRequest(jwt, reference, input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    fail(400, "Invalid request body");
  }

  const rule = ACTIONS[input.action];

  if (!rule) {
    fail(422, "Unknown workflow action");
  }

  const reason = input.reason === undefined ? "" : input.reason;

  if (typeof reason !== "string" || reason.length > 300) {
    fail(422, "Reason must be 300 characters or fewer");
  }

  if (["resolve", "reject"].includes(input.action) &&
      reason.trim().length < 5) {
    fail(422, "A reason of at least 5 characters is required");
  }

  const { user, staff } = await authenticateStaff(jwt);
  const db = new TablesDB(makeClient(null));
  const request = await findRequest(db, reference);

  if (request.status !== rule.from) {
    fail(409, "Invalid status transition. Refresh the request");
  }

  const manager = MANAGERS.has(staff.role);
  const departmentHead =
    staff.role === "department_head" &&
    Boolean(staff.departmentId) &&
    staff.departmentId === request.assignedDepartmentId;

  if (input.action === "assign" ? !manager : !(manager || departmentHead)) {
    fail(403, "Your staff role cannot perform this action");
  }

  let departmentId = request.assignedDepartmentId || null;

  if (input.action === "assign") {
    departmentId = input.departmentId;

    if (typeof departmentId !== "string" ||
        !/^[A-Za-z0-9_-]{1,64}$/.test(departmentId)) {
      fail(422, "Valid departmentId required");
    }

    let department;

    try {
      department = await db.getRow({
        databaseId: DB,
        tableId: "departments",
        rowId: departmentId
      });
    } catch (error) {
      if (error.code === 404) {
        fail(422, "Department not found");
      }
      throw error;
    }

    if (department.active === false ||
        department.status === "inactive") {
      fail(422, "Department is inactive");
    }
  }

  const transaction = await db.createTransaction();
  let committed = false;

  try {
    // Re-read inside the transaction to detect stale workflow state.
    const current = await db.getRow({
      databaseId: DB,
      tableId: "service_requests",
      rowId: request.$id,
      transactionId: transaction.$id
    });

    if (current.status !== rule.from ||
        (current.assignedDepartmentId || null) !==
        (request.assignedDepartmentId || null)) {
      fail(409, "Request changed. Refresh and retry");
    }

    const changes = { status: rule.to };

    if (input.action === "assign") {
      changes.assignedDepartmentId = departmentId;
    }

    await db.updateRow({
      databaseId: DB,
      tableId: "service_requests",
      rowId: request.$id,
      data: changes,
      transactionId: transaction.$id
    });

    await db.createRow({
      databaseId: DB,
      tableId: "audit_logs",
      rowId: ID.unique(),
      data: {
        actorId: staff.$id,
        actorRole: staff.role,
        action: "service_request_" + input.action,
        entityType: "service_request",
        entityId: request.$id,
        description: "Service request changed to " + rule.to,
        ipAddress: "127.0.0.1",
        severity: "info",
        eventTime: new Date().toISOString(),
        metadata: JSON.stringify({
          reference,
          previousStatus: rule.from,
          newStatus: rule.to,
          departmentId,
          reason: reason.trim(),
          staffUserId: user.$id
        })
      },
      permissions: [],
      transactionId: transaction.$id
    });

    await db.updateTransaction({
      transactionId: transaction.$id,
      commit: true
    });

    committed = true;
  } catch (error) {
    if (!committed) {
      try {
        await db.updateTransaction({
          transactionId: transaction.$id,
          rollback: true
        });
      } catch {
        // Report the original error.
      }
    }
    throw error;
  }

  return {
    status: 200,
    result: {
      requestReference: reference,
      previousStatus: rule.from,
      status: rule.to,
      assignedDepartmentId: departmentId,
      auditRecorded: true
    }
  };
}

async function getRequestAudit(jwt, reference) {
  await authenticateStaff(jwt);

  const db = new TablesDB(makeClient(null));
  const request = await findRequest(db, reference);

  // Development preview only; scan limit is not a complete audit history.
  const result = await db.listRows({
    databaseId: DB,
    tableId: "audit_logs",
    queries: [Query.limit(100)]
  });

  const events = result.rows
    .filter(row => row.entityId === request.$id)
    .sort((a, b) => b.eventTime.localeCompare(a.eventTime))
    .map(row => ({
      action: row.action,
      actorRole: row.actorRole,
      description: row.description,
      eventTime: row.eventTime,
      metadata: row.metadata
    }));

  return {
    status: 200,
    result: {
      reference,
      events,
      scannedRows: result.rows.length,
      completeHistory: false
    }
  };
}

module.exports = { transitionServiceRequest, getRequestAudit };
