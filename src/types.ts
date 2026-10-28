export type SectionId =
  | "dashboard"
  | "revenue"
  | "payments"
  | "budgets"
  | "expenditure"
  | "residents"
  | "requests"
  | "sms"
  | "ai"
  | "reports"
  | "settings";

export type PaymentStatus = "Paid" | "Pending" | "Overdue";
export type SmsAutomationStatus = "Active" | "Paused";
export type SmsDeliveryStatus = "Delivered" | "Queued" | "Failed";

export interface Transaction {
  id: string;
  resident: string;
  reference: string;
  category: string;
  ward: string;
  method: string;
  amount: number;
  time: string;
  dateGroup: string;
}

export interface RevenueSource {
  label: string;
  amount: number;
  progress: number;
}

export interface ResidentRecord {
  id: string;
  name: string;
  ward: string;
  propertyRef: string;
  balance: number;
  status: PaymentStatus;
  phone: string;
  smsEnabled: boolean;
  lastSms: string;
  smsCount: number;
}

export interface SmsAutomation {
  id: string;
  name: string;
  description: string;
  audience: string;
  schedule: string;
  nextRun: string;
  status: SmsAutomationStatus;
  type: "billing" | "payment" | "service" | "emergency";
}

export interface ScheduledSms {
  id: string;
  title: string;
  audience: string;
  sendAt: string;
  recipients: number;
}

export interface SmsLog {
  id: string;
  recipient: string;
  subject: string;
  time: string;
  channel: string;
  status: SmsDeliveryStatus;
}
