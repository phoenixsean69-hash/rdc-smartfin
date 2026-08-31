import {
  Query,
} from "react-native-appwrite";

import {
  APPWRITE_DATABASE_ID,
  databases,
} from "../lib/appwrite";

export interface ResidentAccount {
  $id: string;
  residentId: string;
  accountNumber: string;
  balance: number;
  arrears: number;
  credit: number;
  status: string;
  lastBillingDate?: string;
  lastPaymentDate?: string;
}

export interface ResidentBill {
  $id: string;
  billNumber: string;
  residentId: string;
  accountId: string;
  revenueSourceId: string;
  description?: string;
  amount: number;
  amountPaid: number;
  balanceDue: number;
  billingDate: string;
  dueDate: string;
  status: string;
}

export interface ResidentPayment {
  $id: string;
  paymentReference: string;
  residentId: string;
  accountId: string;
  billId?: string;
  revenueSourceId: string;
  amount: number;
  paymentMethod: string;
  channel: string;
  currency: string;
  paymentDate: string;
  status: string;
  notes?: string;
}

export interface ResidentFinanceData {
  account: ResidentAccount | null;
  bills: ResidentBill[];
  payments: ResidentPayment[];
}

export async function getResidentFinanceData(
  residentId: string,
): Promise<ResidentFinanceData> {
  const [
    accountResult,
    billsResult,
    paymentsResult,
  ] =
    await Promise.all([
      databases.listDocuments({
        databaseId:
          APPWRITE_DATABASE_ID,

        collectionId:
          "resident_accounts",

        queries: [
          Query.equal(
            "residentId",
            residentId,
          ),
          Query.limit(1),
        ],
      }),

      databases.listDocuments({
        databaseId:
          APPWRITE_DATABASE_ID,

        collectionId:
          "bills",

        queries: [
          Query.equal(
            "residentId",
            residentId,
          ),
          Query.limit(100),
        ],
      }),

      databases.listDocuments({
        databaseId:
          APPWRITE_DATABASE_ID,

        collectionId:
          "payments",

        queries: [
          Query.equal(
            "residentId",
            residentId,
          ),
          Query.limit(100),
        ],
      }),
    ]);

  const residentAccount =
    accountResult.documents.length
      ? (
          accountResult.documents[
            0
          ] as unknown as ResidentAccount
        )
      : null;

  const bills =
    billsResult.documents
      .map(
        (document) =>
          document as unknown as ResidentBill,
      )
      .sort(
        (first, second) =>
          new Date(
            second.dueDate,
          ).getTime() -
          new Date(
            first.dueDate,
          ).getTime(),
      );

  const payments =
    paymentsResult.documents
      .map(
        (document) =>
          document as unknown as ResidentPayment,
      )
      .sort(
        (first, second) =>
          new Date(
            second.paymentDate,
          ).getTime() -
          new Date(
            first.paymentDate,
          ).getTime(),
      );

  return {
    account:
      residentAccount,

    bills,

    payments,
  };
}
