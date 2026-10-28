function processResidentMessage(message) {
  const text = String(message || "").trim().toUpperCase();

  if (["HI", "HELLO", "MENU", "HELP"].includes(text)) {
    return {
      intent: "MENU",
      reply: [
        "Welcome to RDC SmartFinance.",
        "1. Check council balance",
        "2. Report a problem",
        "3. Council announcements",
        "4. Speak to an officer"
      ].join("\n")
    };
  }

  if (text === "1" || text.includes("BALANCE")) {
    return {
      intent: "BALANCE",
      reply: "Balance enquiries require resident account verification."
    };
  }

  if (text === "2" || text.includes("REPORT")) {
    return {
      intent: "COMPLAINT",
      reply: "Complaint registration is not connected yet."
    };
  }

  if (text === "3") {
    return {
      intent: "ANNOUNCEMENTS",
      reply: "No demonstration announcements are available."
    };
  }

  if (text === "4") {
    return {
      intent: "HUMAN_HANDOFF",
      reply: "Council officer handoff is not connected yet."
    };
  }

  return {
    intent: "UNKNOWN",
    reply: "Send MENU to see available services."
  };
}

module.exports = { processResidentMessage };
