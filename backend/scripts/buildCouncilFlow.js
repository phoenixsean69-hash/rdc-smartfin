const fs = require("node:fs");
const path = require("node:path");

const option = (id, title) => ({ id, title });

const heading = (text) => ({
  type: "TextHeading", text
});

const body = (text) => ({
  type: "TextBody", text
});

const input = (name, label, required = true) => ({
  type: "TextInput",
  name, label, required,
  "input-type": "text"
});

const area = (name, label) => ({
  type: "TextArea",
  name, label, required: true
});

const dropdown = (name, label, values) => ({
  type: "Dropdown",
  name, label, required: true,
  "data-source": values.map(([id, title]) => option(id, title))
});

const radio = (name, label, values) => ({
  type: "RadioButtonsGroup",
  name, label, required: true,
  "data-source": values.map(([id, title]) => option(id, title))
});

const complete = (label, payload) => ({
  type: "Footer",
  label,
  "on-click-action": {
    name: "complete",
    payload
  }
});

const next = (target, payload = {}) => ({
  type: "Footer",
  label: "Continue",
  "on-click-action": {
    name: "navigate",
    next: { type: "screen", name: target },
    payload
  }
});

function screen(id, title, fields, terminal = true, data = {}) {
  return {
    id,
    title,
    ...(terminal ? { terminal: true, success: true } : {}),
    data,
    layout: {
      type: "SingleColumnLayout",
      children: [{
        type: "Form",
        name: `${id.toLowerCase()}_form`,
        children: fields
      }]
    }
  };
}

// Each home item opens its own service screen.
const menu = [
  ["billing", "Billing & Payments", "Bills and payments", "BILL_SERVICES"],
  ["report", "Report a Problem", "Service complaints", "PROBLEM"],
  ["permit", "Permits & Applications", "Council permits", "PERMIT"],
  ["appointment", "Book an Appointment", "Council visits", "APPOINTMENT"],
  ["support", "Chat with an Officer", "Human support", "SUPPORT"],
  ["documents", "Statements & Receipts", "Request documents", "DOCUMENTS"],
  ["updates", "Council Updates", "News and alerts", "UPDATES"],
  ["tracking", "Track a Request", "Check request status", "TRACKING"]
];

const home = {
  id: "HOME",
  title: "RDC SmartFinance",
  data: {},
  layout: {
    type: "SingleColumnLayout",
    children: [{
      type: "NavigationList",
      name: "council_services",
      label: "Choose a council service",
      "list-items": menu.map(([id, title, description, target]) => ({
        id,
        "main-content": { title, description },
        "on-click-action": {
          name: "navigate",
          next: { type: "screen", name: target },
          payload: {}
        }
      }))
    }]
  }
};

const billingServices = [
  ["water", "Water bills"],
  ["rates", "Property rates"],
  ["refuse", "Refuse collection"],
  ["market", "Market and stall fees"],
  ["land", "Land and stand charges"],
  ["licence", "Business licences"],
  ["rental", "Council rentals"],
  ["levy", "Other council levies"]
];

const screens = [
  home,

  screen("BILL_SERVICES", "Council Billing", [
    heading("Manage your bills"),
    body("Choose the council service you want to enquire about."),
    dropdown("service", "Billing service", billingServices),
    next("BILL_REQUEST", {
      service: "${form.service}"
    })
  ], false),

  screen("BILL_REQUEST", "Billing Request", [
    heading("Your billing account"),
    body("Balances and payment instructions require identity verification. This form does not charge you."),
    input("account_reference", "Account reference"),
    radio("request_type", "What do you need?", [
      ["balance", "Check my balance"],
      ["payment", "Request payment instructions"],
      ["statement", "Request a statement"]
    ]),
    complete("Submit billing request", {
      journey: "billing",
      service: "${data.service}",
      account_reference: "${form.account_reference}",
      request_type: "${form.request_type}"
    })
  ], true, {
    service: { type: "string", "__example__": "water" }
  }),

  screen("PROBLEM", "Report a Problem", [
    heading("Report a council issue"),
    body("Tell us what needs attention. Submission does not yet create a live council ticket."),
    dropdown("category", "Problem category", [
      ["water", "Water supply"],
      ["road", "Roads and drainage"],
      ["waste", "Refuse and waste"],
      ["lighting", "Street lighting"],
      ["sanitation", "Sanitation"],
      ["other", "Other or feedback"]
    ]),
    input("location", "Area or ward"),
    area("description", "Describe the problem"),
    complete("Submit report", {
      journey: "complaint",
      category: "${form.category}",
      location: "${form.location}",
      description: "${form.description}"
    })
  ]),

  screen("PERMIT", "Permit Application", [
    heading("Council applications"),
    body("Submit an initial enquiry. This is not yet an approved permit application."),
    dropdown("permit_type", "Application type", [
      ["business", "Business licence"],
      ["building", "Building permit"],
      ["trading", "Trading permit"],
      ["land", "Land or stand enquiry"],
      ["other", "Other council service"]
    ]),
    input("area", "Area or ward"),
    area("details", "Application details"),
    complete("Submit enquiry", {
      journey: "application",
      permit_type: "${form.permit_type}",
      area: "${form.area}",
      details: "${form.details}"
    })
  ]),

  screen("APPOINTMENT", "Council Appointment", [
    heading("Request an appointment"),
    body("Choose a department and propose a date. Appointment availability is not checked yet."),
    dropdown("department", "Department", [
      ["finance", "Finance and billing"],
      ["water", "Water services"],
      ["planning", "Planning and permits"],
      ["housing", "Housing and land"],
      ["general", "General enquiries"]
    ]),
    input("preferred_date", "Date YYYY-MM-DD"),
    area("reason", "Reason for visit"),
    complete("Request appointment", {
      journey: "appointment",
      department: "${form.department}",
      preferred_date: "${form.preferred_date}",
      reason: "${form.reason}"
    })
  ]),

  screen("SUPPORT", "Council Officer", [
    heading("Talk to an officer"),
    body("Request human assistance. The actual conversation will continue in normal WhatsApp chat when staff messaging is connected."),
    dropdown("department", "Support department", [
      ["billing", "Billing and accounts"],
      ["water", "Water services"],
      ["permits", "Permits and licensing"],
      ["general", "General support"]
    ]),
    area("reason", "How can we help?"),
    complete("Request human support", {
      journey: "human_support",
      department: "${form.department}",
      reason: "${form.reason}"
    })
  ]),

  screen("DOCUMENTS", "Council Documents", [
    heading("Request a document"),
    body("Document access will require verification. Do not enter passwords or PINs."),
    dropdown("document_type", "Document type", [
      ["statement", "Account statement"],
      ["receipt", "Payment receipt"],
      ["bill", "Copy of bill"],
      ["other", "Other document"]
    ]),
    input("account_reference", "Account reference"),
    input("document_reference", "Document reference", false),
    complete("Request document", {
      journey: "documents",
      document_type: "${form.document_type}",
      account_reference: "${form.account_reference}",
      document_reference: "${form.document_reference}"
    })
  ]),

  screen("UPDATES", "Council Updates", [
    heading("Council announcements"),
    body("Choose updates you are interested in. This does not yet activate a subscription."),
    dropdown("topic", "Updates category", [
      ["water", "Water interruptions"],
      ["waste", "Waste collection"],
      ["meetings", "Council meetings"],
      ["rates", "Rates and billing"],
      ["general", "General announcements"]
    ]),
    radio("preference", "Receive updates?", [
      ["yes", "Yes, request updates"],
      ["no", "No, just enquire"]
    ]),
    complete("Submit preference", {
      journey: "updates",
      topic: "${form.topic}",
      preference: "${form.preference}"
    })
  ]),

  screen("TRACKING", "Track a Request", [
    heading("Check request progress"),
    body("Enter an existing reference. Live status retrieval will require backend integration."),
    dropdown("request_category", "Request type", [
      ["complaint", "Complaint"],
      ["permit", "Permit application"],
      ["appointment", "Appointment"],
      ["payment", "Payment enquiry"]
    ]),
    input("request_reference", "Request reference"),
    complete("Request status", {
      journey: "tracking",
      request_category: "${form.request_category}",
      request_reference: "${form.request_reference}"
    })
  ])
];

const flow = {
  version: "7.3",
  screens
};

// Basic structural checks before opening Meta.
const ids = new Set(screens.map(s => s.id));
if (ids.size !== screens.length) {
  throw new Error("Duplicate screen ID");
}

const targets = [
  ...menu.map(item => item[3]),
  "BILL_REQUEST"
];

for (const target of targets) {
  if (!ids.has(target)) throw new Error(`Missing screen: ${target}`);
}

for (const s of screens.filter(s => s.terminal)) {
  const form = s.layout.children[0];
  const footer = form.children.at(-1);

  if (footer.type !== "Footer" ||
      footer["on-click-action"].name !== "complete") {
    throw new Error(`Invalid terminal screen: ${s.id}`);
  }
}

const output = path.join(
  process.cwd(), "flows", "council-services.flow.json"
);

fs.writeFileSync(output, JSON.stringify(flow, null, 2) + "\n");

console.log("Created:", output);
console.log("Total screens:", screens.length);
console.log("Home services:", menu.length);
console.log("Billing categories:", billingServices.length);
console.log("JSON size:", fs.statSync(output).size, "bytes");
console.log("Local structure checks: PASS");
