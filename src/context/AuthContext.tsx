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
  Query,
} from "react-native-appwrite";

import {
  account,
  APPWRITE_DATABASE_ID,
  databases,
} from "../lib/appwrite";

export interface Resident {
  $id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  nationalId?: string;
  address: string;
  ward: string;
  propertyNumber?: string;
  smsEnabled: boolean;
  status: string;
}

export type AppwriteUser =
  Awaited<ReturnType<typeof account.get>>;

interface AuthContextValue {
  user: AppwriteUser | null;
  resident: Resident | null;
  loading: boolean;
  error: string;
  login: (
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshResident: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | null>(
    null,
  );

async function findResident(
  userId: string,
): Promise<Resident> {
  const result =
    await databases.listDocuments({
      databaseId:
        APPWRITE_DATABASE_ID,

      collectionId:
        "residents",

      queries: [
        Query.equal(
          "userId",
          userId,
        ),
        Query.limit(1),
      ],
    });

  if (
    result.documents.length === 0
  ) {
    throw new Error(
      "No resident profile is linked to this SmartPay account.",
    );
  }

  const resident =
    result.documents[0] as unknown as Resident;

  if (
    resident.status !==
    "active"
  ) {
    throw new Error(
      "This resident account is currently inactive.",
    );
  }

  return resident;
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    user,
    setUser,
  ] =
    useState<AppwriteUser | null>(
      null,
    );

  const [
    resident,
    setResident,
  ] =
    useState<Resident | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const bootstrap =
    useCallback(async () => {
      setLoading(true);
      setError("");

      try {
        const currentUser =
          await account.get();

        const currentResident =
          await findResident(
            currentUser.$id,
          );

        setUser(
          currentUser,
        );

        setResident(
          currentResident,
        );
      } catch {
        setUser(null);
        setResident(null);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const login =
    useCallback(
      async (
        email: string,
        password: string,
      ) => {
        setLoading(true);
        setError("");

        try {
          await account.createEmailPasswordSession({
            email:
              email.trim(),
            password,
          });

          const currentUser =
            await account.get();

          const currentResident =
            await findResident(
              currentUser.$id,
            );

          setUser(
            currentUser,
          );

          setResident(
            currentResident,
          );
        } catch (err) {
          try {
            await account.deleteSession({
              sessionId:
                "current",
            });
          } catch {
            // No active session.
          }

          setUser(null);
          setResident(null);

          const message =
            err instanceof Error
              ? err.message
              : "Unable to sign in.";

          setError(message);

          throw err;
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  const logout =
    useCallback(async () => {
      setLoading(true);

      try {
        await account.deleteSession({
          sessionId:
            "current",
        });
      } finally {
        setUser(null);
        setResident(null);
        setError("");
        setLoading(false);
      }
    }, []);

  const refreshResident =
    useCallback(async () => {
      if (!user) {
        return;
      }

      const currentResident =
        await findResident(
          user.$id,
        );

      setResident(
        currentResident,
      );
    }, [user]);

  const value =
    useMemo(
      () => ({
        user,
        resident,
        loading,
        error,
        login,
        logout,
        refreshResident,
      }),
      [
        user,
        resident,
        loading,
        error,
        login,
        logout,
        refreshResident,
      ],
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}
