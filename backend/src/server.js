require("dotenv").config();

const express = require("express");
const twilio = require("twilio");

const {
  handleMessage,
  getConversation,
  officerReply
} = require("./conversationManager");

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false, limit: "16kb" }));

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "rdc-smartfinance-whatsapp",
    mode: process.env.NODE_ENV || "development"
  });
});

// Local development API only.
// These unauthenticated routes must not be deployed publicly.
if (process.env.NODE_ENV !== "production") {
  app.post("/api/dev/message", async (req, res) => {
    try {
      const result = await handleMessage(
        req.body.sessionId || "demo-resident",
        req.body.message
      );

      res.json(result);
    } catch (error) {
      console.error("Demo message failed:", error.message);
      res.status(400).json({ error: "Demo message failed" });
    }
  });

  app.get("/api/dev/conversations/:id", async (req, res) => {
    const conversation = await getConversation(req.params.id);

    if (!conversation) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(conversation);
  });

  app.post("/api/dev/officer-reply", async (req, res) => {
    try {
      const result = await officerReply(
        req.body.sessionId,
        req.body.message
      );

      res.json(result);
    } catch (error) {
      console.error("Demo officer reply failed:", error.message);
      res.status(400).json({ error: "Demo officer reply failed" });
    }
  });
}

// Development-only billing Flow simulator.
// Never expose this unauthenticated endpoint publicly.
if (process.env.NODE_ENV !== "production") {
  const { handleBillingRequest } = require("./waterBilling");

  app.post("/api/dev/billing/flow", (req, res) => {
    const result = handleBillingRequest(req.body);
    if (result.error) {
      return res.status(result.status).json({
        error: result.error
      });
    }
    return res.status(result.status).json(result.data);
  });
}
if (process.env.NODE_ENV !== "production") {
  const { processFlowSubmission } = require("./flowProcessor");

  app.post("/api/dev/flow-submission", (req, res) => {
    const result = processFlowSubmission(req.body);
    return res.status(result.status).json(
      result.error ? { error: result.error } : result.result
    );
  });
}
if (process.env.NODE_ENV !== "production") {
  const { persistServiceRequest, getServiceRequestStatus } = require("./appwriteStore");

  // Local testing only. Not a public resident submission API.
  app.post("/api/dev/service-requests", async (req, res) => {
    try {
      const result = await persistServiceRequest(req.body);

      return res.status(result.status).json(
        result.error ? { error: result.error } : result.result
      );
    } catch (error) {
      console.error("Service request write failed:", error.code || "unknown");

      return res.status(502).json({
        error: "Unable to save service request"
      });
    }
  });
}
if (process.env.NODE_ENV !== "production") {
  const { getServiceRequestStatus } = require("./appwriteStore");
  // Local development tracking endpoint only.
  app.get("/api/dev/service-requests/:reference/status", async (req, res) => {
    try {
      const result = await getServiceRequestStatus(req.params.reference);

      return res.status(result.status).json(
        result.error ? { error: result.error } : result.result
      );
    } catch (error) {
      console.error("Service request lookup failed:", { code: error.code, type: error.type, message: error.message });

      return res.status(502).json({
        error: "Unable to retrieve service request"
      });
    }
  });
}
// Genuine Twilio messages require signature verification.
// Live WhatsApp processing is deliberately not activated yet.
app.post("/webhooks/twilio/whatsapp", (req, res) => {
  const token = process.env.TWILIO_AUTH_TOKEN;
  const url = process.env.TWILIO_WEBHOOK_URL;

  if (!token || !url) return res.sendStatus(503);

  const signature = req.get("X-Twilio-Signature") || "";

  if (!twilio.validateRequest(token, signature, url, req.body)) {
    return res.sendStatus(403);
  }

  // No personal messages or phone numbers are stored by this handler.
  console.log("Verified inbound Twilio webhook received.");

  return res.sendStatus(200);
});

const port = Number(process.env.PORT || 8300);

app.listen(port, "127.0.0.1", () => {
  console.log(`RDC backend running at http://127.0.0.1:${port}`);
});
