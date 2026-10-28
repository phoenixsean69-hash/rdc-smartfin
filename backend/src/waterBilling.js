const { randomUUID } = require("node:crypto");

// Fictional test data only.
// Real billing will be read from Appwrite after authorization.
const demoBill = {
  service: "water",
  accountReference: "DEMO-WATER-001",
  billNumber: "DEMO-BILL-001",
  description: "Demonstration water bill",
  currency: "USD",
  amountDue: 24.50,
  amountPaid: 0,
  dueDate: "2026-11-15"
};

function handleBillingRequest(input) {
  const service = String(input?.service || "").trim();
  const reference = String(input?.account_reference || "").trim();
  const requestType = String(input?.request_type || "").trim();

  if (!["water", "rates", "refuse"].includes(service)) {
    return { status: 400, error: "Invalid service" };
  }

  if (!["balance", "payment"].includes(requestType)) {
    return { status: 400, error: "Invalid request type" };
  }

  if (!/^[A-Za-z0-9-]{1,40}$/.test(reference)) {
    return { status: 400, error: "Invalid account reference" };
  }

  if (service !== "water") {
    return {
      status: 501,
      error: "This service is not implemented yet"
    };
  }

  if (reference !== demoBill.accountReference) {
    return {
      status: 404,
      error: "Only DEMO-WATER-001 is available for testing"
    };
  }

  const requestId = `DEMO-${randomUUID()}`;

  if (requestType === "balance") {
    return {
      status: 200,
      data: {
        simulation: true,
        requestId,
        verification: "NOT_PERFORMED",
        bill: demoBill,
        warning: "Fictional bill. Never disclose real balances without identity verification."
      }
    };
  }

  return {
    status: 200,
    data: {
      simulation: true,
      requestId,
      billNumber: demoBill.billNumber,
      amount: demoBill.amountDue,
      currency: demoBill.currency,
      paymentStatus: "NOT_INITIATED",
      checkoutUrl: null,
      message: "Demo payment request prepared. No money was transferred."
    }
  };
}

module.exports = { handleBillingRequest };
