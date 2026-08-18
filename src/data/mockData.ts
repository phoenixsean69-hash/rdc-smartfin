import type {
  ResidentRecord,
  RevenueSource,
  ScheduledSms,
  SmsAutomation,
  SmsLog,
  Transaction,
} from "../types";

export const monthlyRevenue = [
  44, 66, 58, 49, 53, 47, 60, 51, 56, 73, 62, 55,
  49, 57, 66, 53, 59, 71, 63, 52, 58, 79, 61, 69,
];

export const revenueSources: RevenueSource[] = [
  { label: "Property Rates", amount: 68420, progress: 76 },
  { label: "Business Licences", amount: 42760, progress: 61 },
  { label: "Refuse Collection", amount: 29140, progress: 54 },
  { label: "Market Fees", amount: 24300, progress: 46 },
  { label: "Development Levies", amount: 20000, progress: 39 },
];

export const transactions: Transaction[] = [
  {
    id: "TXN-10482",
    resident: "Tawanda Moyo",
    reference: "PROP-0412",
    category: "Property Rates",
    ward: "Ward 4",
    method: "Mobile Money",
    amount: 85,
    time: "09:42",
    dateGroup: "Today",
  },
  {
    id: "TXN-10481",
    resident: "Martha Chikowore",
    reference: "BUS-0198",
    category: "Business Licence",
    ward: "Ward 2",
    method: "Card",
    amount: 120,
    time: "09:18",
    dateGroup: "Today",
  },
  {
    id: "TXN-10480",
    resident: "Simbarashe Ncube",
    reference: "REF-2081",
    category: "Refuse Collection",
    ward: "Ward 7",
    method: "USSD",
    amount: 18,
    time: "08:55",
    dateGroup: "Today",
  },
  {
    id: "TXN-10479",
    resident: "Rudo Nyathi",
    reference: "MRK-0076",
    category: "Market Fees",
    ward: "Ward 1",
    method: "Cash Office",
    amount: 12,
    time: "15:26",
    dateGroup: "Yesterday",
  },
  {
    id: "TXN-10478",
    resident: "Blessing Dube",
    reference: "DEV-0114",
    category: "Development Levy",
    ward: "Ward 5",
    method: "Mobile Money",
    amount: 40,
    time: "14:02",
    dateGroup: "Yesterday",
  },
];

export const residents: ResidentRecord[] = [
  {
    id: "RES-0001",
    name: "Tawanda Moyo",
    ward: "Ward 4",
    propertyRef: "PROP-0412",
    balance: 0,
    status: "Paid",
    phone: "+263 77 245 0182",
    smsEnabled: true,
    lastSms: "Today, 09:43",
    smsCount: 3,
  },
  {
    id: "RES-0002",
    name: "Martha Chikowore",
    ward: "Ward 2",
    propertyRef: "PROP-0198",
    balance: 34,
    status: "Pending",
    phone: "+263 71 821 1477",
    smsEnabled: true,
    lastSms: "16 Aug, 18:00",
    smsCount: 4,
  },
  {
    id: "RES-0003",
    name: "Simbarashe Ncube",
    ward: "Ward 7",
    propertyRef: "PROP-2081",
    balance: 76,
    status: "Overdue",
    phone: "+263 78 094 3221",
    smsEnabled: true,
    lastSms: "Today, 08:00",
    smsCount: 6,
  },
  {
    id: "RES-0004",
    name: "Rudo Nyathi",
    ward: "Ward 1",
    propertyRef: "PROP-0076",
    balance: 12,
    status: "Pending",
    phone: "+263 77 601 4358",
    smsEnabled: false,
    lastSms: "12 Aug, 10:15",
    smsCount: 1,
  },
  {
    id: "RES-0005",
    name: "Blessing Dube",
    ward: "Ward 5",
    propertyRef: "PROP-0114",
    balance: 0,
    status: "Paid",
    phone: "+263 71 533 9874",
    smsEnabled: true,
    lastSms: "Yesterday, 14:03",
    smsCount: 2,
  },
  {
    id: "RES-0006",
    name: "Nomsa Sibanda",
    ward: "Ward 3",
    propertyRef: "PROP-0328",
    balance: 114,
    status: "Overdue",
    phone: "+263 78 661 7754",
    smsEnabled: true,
    lastSms: "Today, 08:00",
    smsCount: 7,
  },
];

export const kpis = [
  { label: "Revenue collected", value: "$184,620", change: "+12.4%", tone: "good" },
  { label: "Outstanding", value: "$72,480", change: "-4.7%", tone: "good" },
  { label: "Expenditure", value: "$96,340", change: "+3.1%", tone: "neutral" },
  { label: "Collection rate", value: "71.4%", change: "+6.8%", tone: "good" },
] as const;

export const budgetRows = [
  { department: "Roads & Works", allocated: 185000, spent: 121800 },
  { department: "Water & Sanitation", allocated: 146000, spent: 93200 },
  { department: "Health Services", allocated: 98000, spent: 67400 },
  { department: "Waste Management", allocated: 86000, spent: 55900 },
  { department: "Administration", allocated: 74000, spent: 48300 },
];

export const expenditureRows = [
  { description: "Grader maintenance", department: "Roads & Works", amount: 8400, date: "16 Aug 2026" },
  { description: "Water treatment chemicals", department: "Water & Sanitation", amount: 6150, date: "16 Aug 2026" },
  { description: "Clinic supplies", department: "Health Services", amount: 3890, date: "15 Aug 2026" },
  { description: "Refuse truck fuel", department: "Waste Management", amount: 2140, date: "15 Aug 2026" },
  { description: "Office connectivity", department: "Administration", amount: 1280, date: "14 Aug 2026" },
];

export const aiInsights = [
  {
    title: "Ward 4 property-rate collections are below trend",
    body: "Collections are 18% below the four-week average. The largest gap is concentrated in 46 properties with balances above $40.",
    action: "Prioritise reminder notices for the 46 accounts.",
    severity: "high",
  },
  {
    title: "Market-fee collection improved this week",
    body: "Recorded market-fee revenue is 11% above the previous weekly average, driven mainly by Ward 1 and Ward 3.",
    action: "Review the collection approach in those wards for reuse elsewhere.",
    severity: "positive",
  },
  {
    title: "Unusual expenditure pattern flagged",
    body: "Vehicle-fuel expenditure has three transactions within a short interval that are higher than the normal daily range.",
    action: "Verify supporting documents before month-end reconciliation.",
    severity: "medium",
  },
];

export const smsAutomations: SmsAutomation[] = [
  {
    id: "SMS-A01",
    name: "Monthly rates reminder",
    description: "Remind residents that monthly property rates are due.",
    audience: "All SMS-enabled residents",
    schedule: "Monthly • 25th • 08:00",
    nextRun: "25 Aug, 08:00",
    status: "Active",
    type: "billing",
  },
  {
    id: "SMS-A02",
    name: "Overdue account alert",
    description: "Warn residents after an account has been overdue for seven days.",
    audience: "Residents overdue > 7 days",
    schedule: "Event trigger",
    nextRun: "Automatic",
    status: "Active",
    type: "billing",
  },
  {
    id: "SMS-A03",
    name: "Payment confirmation",
    description: "Send a receipt confirmation immediately after a successful payment.",
    audience: "Individual payer",
    schedule: "Payment trigger",
    nextRun: "Automatic",
    status: "Active",
    type: "payment",
  },
  {
    id: "SMS-A04",
    name: "Refuse collection reminder",
    description: "Notify selected wards before scheduled refuse collection.",
    audience: "Ward 1, 3, 4 and 6",
    schedule: "Weekly • Monday • 18:00",
    nextRun: "17 Aug, 18:00",
    status: "Active",
    type: "service",
  },
  {
    id: "SMS-A05",
    name: "30-day debt escalation",
    description: "Send an urgent reminder when a balance remains overdue for 30 days.",
    audience: "Long-overdue accounts",
    schedule: "Event trigger",
    nextRun: "Automatic",
    status: "Paused",
    type: "billing",
  },
];

export const scheduledSms: ScheduledSms[] = [
  {
    id: "SMS-S01",
    title: "Water maintenance notice",
    audience: "Ward 4 residents",
    sendAt: "18 Aug 2026 • 07:00",
    recipients: 428,
  },
  {
    id: "SMS-S02",
    title: "Public budget consultation",
    audience: "All residents",
    sendAt: "20 Aug 2026 • 09:00",
    recipients: 2301,
  },
  {
    id: "SMS-S03",
    title: "Market stall renewal reminder",
    audience: "Registered market traders",
    sendAt: "21 Aug 2026 • 08:30",
    recipients: 186,
  },
];

export const smsLogs: SmsLog[] = [
  { id: "SMS-L01", recipient: "Tawanda Moyo", subject: "Payment received — receipt TXN-10482", time: "09:43", channel: "Automatic", status: "Delivered" },
  { id: "SMS-L02", recipient: "Simbarashe Ncube", subject: "Outstanding account reminder", time: "08:00", channel: "Automation", status: "Delivered" },
  { id: "SMS-L03", recipient: "Nomsa Sibanda", subject: "Outstanding account reminder", time: "08:00", channel: "Automation", status: "Delivered" },
  { id: "SMS-L04", recipient: "Ward 3 • 312 residents", subject: "Refuse collection reminder", time: "Yesterday", channel: "Scheduled", status: "Delivered" },
  { id: "SMS-L05", recipient: "Rudo Nyathi", subject: "Monthly rates reminder", time: "Yesterday", channel: "Automation", status: "Failed" },
];
