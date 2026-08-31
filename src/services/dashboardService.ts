import { Query } from "appwrite";

import {
  APPWRITE_DATABASE_ID,
  databases,
} from "../lib/appwrite";

interface PaymentDocument {
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
}

interface BillDocument {
  $id: string;
  billNumber: string;
  amount: number;
  amountPaid: number;
  balanceDue: number;
  status: string;
}

interface ExpenditureDocument {
  $id: string;
  expenditureNumber: string;
  amount: number;
  expenditureDate: string;
  status: string;
  flagged: boolean;
}

interface ResidentDocument {
  $id: string;
  firstName: string;
  lastName: string;
  ward: string;
  phone: string;
}

interface RevenueSourceDocument {
  $id: string;
  name: string;
  code: string;
  category: string;
  active: boolean;
}

interface AiInsightDocument {
  $id: string;
  insightType: string;
  title: string;
  summary: string;
  recommendation: string;
  severity: string;
  confidence: number;
  status: string;
  generatedAt: string;
}

export interface DashboardTransaction {
  id: string;
  reference: string;
  category: string;
  resident: string;
  ward: string;
  method: string;
  channel: string;
  amount: number;
  time: string;
  dateGroup: string;
  paymentDate: string;
}

export interface DashboardRevenueSource {
  id: string;
  label: string;
  amount: number;
  progress: number;
}

export interface DashboardAiInsight {
  id: string;
  type: string;
  title: string;
  summary: string;
  recommendation: string;
  severity: string;
  confidence: number;
}

export interface DashboardMetrics {
  revenueCollected: number;
  outstandingBalance: number;
  approvedExpenditure: number;
  collectionRate: number;

  completedPaymentCount: number;
  outstandingBillCount: number;
  approvedExpenditureCount: number;
  totalBilled: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;

  dailyCollections: number[];
  dailyLabels: string[];
  currentMonthCollected: number;
  periodLabel: string;

  transactions: DashboardTransaction[];
  revenueSources: DashboardRevenueSource[];

  aiInsight: DashboardAiInsight | null;

  updatedAt: string;
}

let cachedDashboardData: DashboardData | null = null;
let dashboardRequest: Promise<DashboardData> | null = null;

export function getCachedDashboardData() {
  return cachedDashboardData;
}

function hasDashboardDataChanged(
  previous: DashboardData,
  next: DashboardData,
) {
  const {
    updatedAt: previousUpdatedAt,
    ...previousContent
  } = previous;
  const {
    updatedAt: nextUpdatedAt,
    ...nextContent
  } = next;

  return JSON.stringify(previousContent) !== JSON.stringify(nextContent);
}

function storeDashboardData(
  next: DashboardData,
) {
  if (
    cachedDashboardData &&
    !hasDashboardDataChanged(
      cachedDashboardData,
      next,
    )
  ) {
    return cachedDashboardData;
  }

  cachedDashboardData = next;

  return next;
}

function numberValue(
  value: unknown,
): number {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function safeDate(
  value: string,
): Date {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return new Date(0);
  }

  return date;
}

function sameMonth(
  first: Date,
  second: Date,
) {
  return (
    first.getFullYear() ===
      second.getFullYear() &&
    first.getMonth() ===
      second.getMonth()
  );
}

function formatDateGroup(
  value: string,
) {
  const date =
    safeDate(value);

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function formatTime(
  value: string,
) {
  const date =
    safeDate(value);

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  ).format(date);
}

async function listCollection<T>(
  collectionId: string,
): Promise<T[]> {
  const response =
    await databases.listDocuments({
      databaseId:
        APPWRITE_DATABASE_ID,

      collectionId,

      queries: [
        Query.limit(100),
      ],
    });

  return response.documents as unknown as T[];
}

export async function loadDashboardData():
  Promise<DashboardData> {
  if (dashboardRequest) {
    return dashboardRequest;
  }

  dashboardRequest = loadFreshDashboardData();

  try {
    return await dashboardRequest;
  } finally {
    dashboardRequest = null;
  }
}

async function loadFreshDashboardData():
  Promise<DashboardData> {
  const [
    payments,
    bills,
    expenditures,
    residents,
    revenueSources,
    aiInsights,
  ] = await Promise.all([
    listCollection<PaymentDocument>(
      "payments",
    ),

    listCollection<BillDocument>(
      "bills",
    ),

    listCollection<ExpenditureDocument>(
      "expenditures",
    ),

    listCollection<ResidentDocument>(
      "residents",
    ),

    listCollection<RevenueSourceDocument>(
      "revenue_sources",
    ),

    listCollection<AiInsightDocument>(
      "ai_insights",
    ),
  ]);

  const completedPayments =
    payments.filter(
      (payment) =>
        String(
          payment.status,
        ).toLowerCase() ===
        "completed",
    );

  const approvedExpenditures =
    expenditures.filter(
      (expenditure) =>
        String(
          expenditure.status,
        ).toLowerCase() ===
        "approved",
    );

  const revenueCollected =
    completedPayments.reduce(
      (total, payment) =>
        total +
        numberValue(
          payment.amount,
        ),
      0,
    );

  const outstandingBalance =
    bills.reduce(
      (total, bill) =>
        total +
        Math.max(
          0,
          numberValue(
            bill.balanceDue,
          ),
        ),
      0,
    );

  const approvedExpenditure =
    approvedExpenditures.reduce(
      (total, expenditure) =>
        total +
        numberValue(
          expenditure.amount,
        ),
      0,
    );

  const totalBilled =
    bills.reduce(
      (total, bill) =>
        total +
        numberValue(
          bill.amount,
        ),
      0,
    );

  const totalPaidAgainstBills =
    bills.reduce(
      (total, bill) =>
        total +
        numberValue(
          bill.amountPaid,
        ),
      0,
    );

  const collectionRate =
    totalBilled > 0
      ? Math.min(
          100,
          (
            totalPaidAgainstBills /
            totalBilled
          ) * 100,
        )
      : 0;

  const outstandingBillCount =
    bills.filter(
      (bill) =>
        numberValue(
          bill.balanceDue,
        ) > 0,
    ).length;

  const now =
    new Date();

  const dayCount =
    now.getDate();

  const dailyCollections =
    Array.from(
      {
        length: dayCount,
      },
      () => 0,
    );

  for (
    const payment
    of completedPayments
  ) {
    const paymentDate =
      safeDate(
        payment.paymentDate,
      );

    if (
      sameMonth(
        paymentDate,
        now,
      )
    ) {
      const index =
        paymentDate.getDate() -
        1;

      if (
        index >= 0 &&
        index <
          dailyCollections.length
      ) {
        dailyCollections[
          index
        ] += numberValue(
          payment.amount,
        );
      }
    }
  }

  const dailyLabels =
    Array.from(
      {
        length: dayCount,
      },
      (_, index) =>
        `${index + 1} ${new Intl.DateTimeFormat(
          "en-GB",
          {
            month: "short",
          },
        ).format(now)}`,
    );

  const currentMonthCollected =
    dailyCollections.reduce(
      (total, amount) =>
        total + amount,
      0,
    );

  const residentMap =
    new Map(
      residents.map(
        (resident) => [
          resident.$id,
          resident,
        ],
      ),
    );

  const revenueSourceMap =
    new Map(
      revenueSources.map(
        (source) => [
          source.$id,
          source,
        ],
      ),
    );

  const sortedPayments =
    [...completedPayments]
      .sort(
        (first, second) =>
          safeDate(
            second.paymentDate,
          ).getTime() -
          safeDate(
            first.paymentDate,
          ).getTime(),
      )
      .slice(
        0,
        6,
      );

  const transactions:
    DashboardTransaction[] =
    sortedPayments.map(
      (payment) => {
        const resident =
          residentMap.get(
            payment.residentId,
          );

        const source =
          revenueSourceMap.get(
            payment.revenueSourceId,
          );

        return {
          id:
            payment.$id,

          reference:
            payment.paymentReference,

          category:
            source?.name ??
            payment.revenueSourceId,

          resident:
            resident
              ? `${resident.firstName} ${resident.lastName}`
              : payment.residentId,

          ward:
            resident?.ward ??
            "Unknown ward",

          method:
            payment.paymentMethod,

          channel:
            payment.channel,

          amount:
            numberValue(
              payment.amount,
            ),

          time:
            formatTime(
              payment.paymentDate,
            ),

          dateGroup:
            formatDateGroup(
              payment.paymentDate,
            ),

          paymentDate:
            payment.paymentDate,
        };
      },
    );

  const revenueTotals =
    new Map<string, number>();

  for (
    const source
    of revenueSources
  ) {
    revenueTotals.set(
      source.$id,
      0,
    );
  }

  for (
    const payment
    of completedPayments
  ) {
    revenueTotals.set(
      payment.revenueSourceId,

      (
        revenueTotals.get(
          payment.revenueSourceId,
        ) ?? 0
      ) +
        numberValue(
          payment.amount,
        ),
    );
  }

  const revenueMixTotal =
    Array.from(
      revenueTotals.values(),
    ).reduce(
      (total, amount) =>
        total + amount,
      0,
    );

  const revenueSourceStats:
    DashboardRevenueSource[] =
    revenueSources
      .map(
        (source) => {
          const amount =
            revenueTotals.get(
              source.$id,
            ) ?? 0;

          return {
            id:
              source.$id,

            label:
              source.name,

            amount,

            progress:
              revenueMixTotal >
              0
                ? (
                    amount /
                    revenueMixTotal
                  ) * 100
                : 0,
          };
        },
      )
      .filter(
        (source) =>
          source.amount > 0,
      )
      .sort(
        (first, second) =>
          second.amount -
          first.amount,
      );

  const severityRank:
    Record<
      string,
      number
    > = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

  const sortedInsights =
    [...aiInsights]
      .filter(
        (insight) =>
          ![
            "dismissed",
            "resolved",
          ].includes(
            String(
              insight.status,
            ).toLowerCase(),
          ),
      )
      .sort(
        (
          first,
          second,
        ) => {
          const severityDifference =
            (
              severityRank[
                String(
                  second.severity,
                ).toLowerCase()
              ] ?? 0
            ) -
            (
              severityRank[
                String(
                  first.severity,
                ).toLowerCase()
              ] ?? 0
            );

          if (
            severityDifference !==
            0
          ) {
            return severityDifference;
          }

          const confidenceDifference =
            numberValue(
              second.confidence,
            ) -
            numberValue(
              first.confidence,
            );

          if (
            confidenceDifference !==
            0
          ) {
            return confidenceDifference;
          }

          return (
            safeDate(
              second.generatedAt,
            ).getTime() -
            safeDate(
              first.generatedAt,
            ).getTime()
          );
        },
      );

  const topInsight =
    sortedInsights[0];

  const aiInsight:
    DashboardAiInsight |
    null =
    topInsight
      ? {
          id:
            topInsight.$id,

          type:
            topInsight.insightType,

          title:
            topInsight.title,

          summary:
            topInsight.summary,

          recommendation:
            topInsight.recommendation,

          severity:
            topInsight.severity,

          confidence:
            numberValue(
              topInsight.confidence,
            ),
        }
      : null;

  return storeDashboardData({
    metrics: {
      revenueCollected,

      outstandingBalance,

      approvedExpenditure,

      collectionRate,

      completedPaymentCount:
        completedPayments.length,

      outstandingBillCount,

      approvedExpenditureCount:
        approvedExpenditures.length,

      totalBilled,
    },

    dailyCollections,

    dailyLabels,

    currentMonthCollected,

    periodLabel:
      new Intl.DateTimeFormat(
        "en-GB",
        {
          month: "long",
          year: "numeric",
        },
      ).format(now),

    transactions,

    revenueSources:
      revenueSourceStats,

    aiInsight,

    updatedAt:
      new Date().toISOString(),
  });
}
