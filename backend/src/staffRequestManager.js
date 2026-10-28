const { Client, Account, TablesDB, Query } = require("node-appwrite");

const DATABASE_ID = "smartpay-db";

function createStaffClient(jwt) {
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const projectId = process.env.APPWRITE_PROJECT_ID;

  if (!endpoint || !projectId) {
    throw new Error("Appwrite configuration missing");
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setJWT(jwt);

  return {
    account: new Account(client),
    database: new TablesDB(client)
  };
}

async function getStaffRequests(jwt) {
  const { account, database } = createStaffClient(jwt);

  // Verify the actual Appwrite user session.
  const user = await account.get();

  // The council_staff table requires council-staff permissions.
  const staffResponse = await database.listRows({
    databaseId: DATABASE_ID,
    tableId: "council_staff",
    queries: [
      Query.equal("userId", user.$id),
      Query.limit(1)
    ]
  });

  const staff = staffResponse.rows[0];

  if (!staff || staff.status !== "active") {
    return {
      status: 403,
      error: "Active council staff access required"
    };
  }

  // Use the user's JWT, not the administrator API key.
  const requests = await database.listRows({
    databaseId: DATABASE_ID,
    tableId: "service_requests",
    queries: [
      Query.limit(25),
      Query.select([
        "requestReference",
        "journey",
        "status",
        "serviceCategory",
        "assignedDepartmentId"
      ])
    ]
  });

  return {
    status: 200,
    result: {
      staff: {
        id: staff.$id,
        role: staff.role
      },
      requests: requests.rows.map(row => ({
        id: row.$id,
        reference: row.requestReference,
        journey: row.journey,
        status: row.status,
        category: row.serviceCategory,
        assignedDepartmentId: row.assignedDepartmentId || null
      }))
    }
  };
}

module.exports = { getStaffRequests };
