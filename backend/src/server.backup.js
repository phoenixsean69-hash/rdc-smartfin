require("dotenv").config();

const express = require("express");
const twilio = require("twilio");
const { processResidentMessage } = require("./residentAssistant");

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false, limit: "16kb" }));

// Local development health check
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "rdc-smartfinance-whatsapp",
    mode: "development"
  });
});

// Local simulator: no resident financial data is exposed
app.post("/api/dev/message", (req, res) => {
  if (!req.is("application/json")) {
    return res.status(415).json({ error: "JSON required" });
  }

  const result = processResidentMessage(req.body?.message);
  return res.json(result);
});

// Twilio webhook: only accepts cryptographically signed requests
app.post("/webhooks/twilio/whatsapp", (req, res) => {
  const token = process.env.TWILIO_AUTH_TOKEN;
  const webhookUrl = process.env.TWILIO_WEBHOOK_URL;

  if (!token || !webhookUrl) {
    return res.sendStatus(503);
  }

  const signature = req.get("X-Twilio-Signature") || "";

  const valid = twilio.validateRequest(
    token,
    signature,
    webhookUrl,
    req.body
  );

  if (!valid) {
    return res.sendStatus(403);
  }

  const result = processResidentMessage(req.body.Body);

  // No arbitrary outbound replies on the limited Twilio trial
  console.log("Verified WhatsApp intent:", result.intent);

  return res.sendStatus(200);
});

const port = Number(process.env.PORT || 8300);

app.listen(port, "127.0.0.1", () => {
  console.log(`RDC WhatsApp backend: http://127.0.0.1:${port}`);
});
