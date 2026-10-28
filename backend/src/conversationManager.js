const fs = require("node:fs/promises");
const path = require("node:path");

const storePath = path.join(
  __dirname, "..", "runtime", "conversations.json"
);

let queue = Promise.resolve();

async function readStore() {
  try {
    return JSON.parse(await fs.readFile(storePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return { conversations: {} };
    throw error;
  }
}

// Serialize local writes to prevent overlapping file updates.
function transaction(callback) {
  const operation = queue.then(async () => {
    const store = await readStore();
    const result = callback(store);
    const temporary = storePath + ".tmp";

    await fs.mkdir(path.dirname(storePath), { recursive: true });
    await fs.writeFile(temporary, JSON.stringify(store, null, 2));
    await fs.rename(temporary, storePath);

    return result;
  });

  queue = operation.then(() => {}, () => {});
  return operation;
}

function addMessage(conversation, sender, text) {
  conversation.messages.push({
    sender,
    text,
    timestamp: new Date().toISOString()
  });
}

function handleMessage(sessionId, message) {
  if (!/^[a-zA-Z0-9_-]{1,50}$/.test(sessionId)) {
    throw new Error("Invalid demo session ID");
  }

  if (typeof message !== "string" ||
      !message.trim() ||
      message.length > 1000) {
    throw new Error("Message must contain 1-1000 characters");
  }

  return transaction((store) => {
    let chat = store.conversations[sessionId];

    if (!chat) {
      chat = {
        id: sessionId,
        mode: "BOT",
        status: "OPEN",
        verification: "NOT_VERIFIED",
        awaitingComplaint: false,
        complaintDrafts: [],
        messages: []
      };
      store.conversations[sessionId] = chat;
    }

    const input = message.trim();
    const command = input.toUpperCase();

    addMessage(chat, "resident", input);

    let intent = "UNKNOWN";
    let reply = "";

    if (command === "0" || command === "BOT") {
      chat.mode = "BOT";
      chat.status = "OPEN";
      chat.awaitingComplaint = false;

      intent = "RETURN_TO_BOT";
      reply = "Automated assistance restored. Send MENU.";

    } else if (chat.mode === "HUMAN") {
      intent = "HUMAN_MESSAGE";
      reply = "Message saved in this demo conversation. " +
        "Live officer delivery is not connected yet.";

    } else if (["4", "HUMAN", "OFFICER"].includes(command)) {
      chat.mode = "HUMAN";
      chat.status = "WAITING_FOR_OFFICER";
      chat.awaitingComplaint = false;

      intent = "HUMAN_HANDOFF";
      reply = "Human support requested. " +
        "This is a local demo, not a live council queue. " +
        "Send 0 to return to the automated assistant.";

    } else if (["MENU", "HI", "HELLO", "HELP"].includes(command)) {
      chat.awaitingComplaint = false;
      intent = "MENU";

      reply = [
        "Welcome to RDC SmartFinance.",
        "1. Check my council balance",
        "2. Report a problem",
        "3. Council announcements",
        "4. Speak to an officer",
        "Send MENU to see this menu again."
      ].join("\n");

    } else if (chat.awaitingComplaint) {
      chat.complaintDrafts.push({
        description: input,
        createdAt: new Date().toISOString(),
        status: "DEMO_DRAFT"
      });

      chat.awaitingComplaint = false;
      intent = "COMPLAINT_DRAFT";

      reply = "Your complaint draft has been saved locally. " +
        "It has not been submitted to a council.";

    } else if (command === "1" || command.includes("BALANCE")) {
      intent = "BALANCE_VERIFICATION";

      reply = "Financial enquiries require verified resident " +
        "identity. Account verification is not connected yet.";

    } else if (command === "2" || command === "REPORT") {
      chat.awaitingComplaint = true;
      intent = "COMPLAINT_PROMPT";

      reply = "Describe the problem you want to report. " +
        "This will be saved as a local demonstration draft.";

    } else if (command === "3") {
      intent = "ANNOUNCEMENTS";
      reply = "No demonstration council announcements available.";

    } else {
      reply = "I didn't understand that. Send MENU.";
    }

    addMessage(chat, "assistant", reply);
    chat.updatedAt = new Date().toISOString();

    return {
      sessionId,
      mode: chat.mode,
      status: chat.status,
      verification: chat.verification,
      intent,
      reply
    };
  });
}

async function getConversation(sessionId) {
  await queue;
  const store = await readStore();
  return store.conversations[sessionId] || null;
}

// Officer simulator: not authenticated real staff messaging.
function officerReply(sessionId, message) {
  if (typeof message !== "string" ||
      !message.trim() ||
      message.length > 1000) {
    throw new Error("Invalid officer message");
  }

  return transaction((store) => {
    const chat = store.conversations[sessionId];

    if (!chat) throw new Error("Conversation not found");
    if (chat.mode !== "HUMAN") {
      throw new Error("Conversation is not in human mode");
    }

    addMessage(chat, "demo-officer", message.trim());
    chat.status = "OFFICER_RESPONDED";
    chat.updatedAt = new Date().toISOString();

    return { ok: true, sessionId, status: chat.status };
  });
}

module.exports = {
  handleMessage,
  getConversation,
  officerReply
};
