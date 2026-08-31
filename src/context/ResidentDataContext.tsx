import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  useAuth,
} from "./AuthContext";

import {
  getResidentFinanceData,
  type ResidentAccount,
  type ResidentBill,
  type ResidentPayment,
} from "../services/residentService";

interface ResidentDataContextValue {
  account: ResidentAccount | null;
  bills: ResidentBill[];
  payments: ResidentPayment[];
  loading: boolean;
  refreshing: boolean;
  error: string;
  outstanding: number;
  refresh: () => Promise<void>;
}

const ResidentDataContext =
  createContext<ResidentDataContextValue | null>(
    null,
  );

export function ResidentDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    resident,
  } = useAuth();

  const [
    account,
    setAccount,
  ] =
    useState<ResidentAccount | null>(
      null,
    );

  const [
    bills,
    setBills,
  ] =
    useState<ResidentBill[]>([]);

  const [
    payments,
    setPayments,
  ] =
    useState<ResidentPayment[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const load =
    useCallback(
      async (
        isRefresh = false,
      ) => {
        if (!resident) {
          setLoading(false);
          return;
        }

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        try {
          const data =
            await getResidentFinanceData(
              resident.$id,
            );

          setAccount(
            data.account,
          );

          setBills(
            data.bills,
          );

          setPayments(
            data.payments,
          );
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your SmartPay account.",
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [resident],
    );

  useEffect(() => {
    void load();
  }, [load]);

  const refresh =
    useCallback(
      async () => {
        await load(true);
      },
      [load],
    );

  const outstanding =
    bills.reduce(
      (
        total,
        bill,
      ) =>
        total +
        Math.max(
          0,
          Number(
            bill.balanceDue,
          ) || 0,
        ),
      0,
    );

  const value =
    useMemo(
      () => ({
        account,
        bills,
        payments,
        loading,
        refreshing,
        error,
        outstanding,
        refresh,
      }),
      [
        account,
        bills,
        payments,
        loading,
        refreshing,
        error,
        outstanding,
        refresh,
      ],
    );

  return (
    <ResidentDataContext.Provider
      value={value}
    >
      {children}
    </ResidentDataContext.Provider>
  );
}

export function useResidentData() {
  const context =
    useContext(
      ResidentDataContext,
    );

  if (!context) {
    throw new Error(
      "useResidentData must be used inside ResidentDataProvider.",
    );
  }

  return context;
}
