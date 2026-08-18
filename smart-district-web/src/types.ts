export type SectionId =
  | "dashboard"
  | "revenue"
  | "payments"
  | "budgets"
  | "expenditure"
  | "residents"
  | "ai"
  | "reports"
  | "settings";

export type PaymentStatus = "Paid" | "Pending" | "Overdue";

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
}
