import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { Query } from "appwrite";

import {
  account,
  APPWRITE_DATABASE_ID,
  databases,
} from "../lib/appwrite";

export interface CouncilStaff {
  $id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  departmentId?: string;
  status: string;
}

export type CurrentUser =
  Awaited<ReturnType<typeof account.get>>;

interface AuthContextValue {
  user: CurrentUser | null;
  staff: CouncilStaff | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

async function getCouncilStaff(
  userId: string,
): Promise<CouncilStaff> {
  const response =
    await databases.listDocuments({
      databaseId: APPWRITE_DATABASE_ID,
      collectionId: "council_staff",
      queries: [
        Query.equal("userId", userId),
        Query.limit(1),
      ],
    });

  if (response.documents.length === 0) {
    throw new Error(
      "This Appwrite account is not registered as council staff.",
    );
  }

  const staff =
    response.documents[0] as unknown as CouncilStaff;

  if (staff.status !== "active") {
    throw new Error(
      "This council staff account is inactive.",
    );
  }

  return staff;
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const [staff, setStaff] =
    useState<CouncilStaff | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refresh =
    useCallback(async () => {
      try {
        const currentUser =
          await account.get();

        const councilStaff =
          await getCouncilStaff(
            currentUser.$id,
          );

        setUser(currentUser);
        setStaff(councilStaff);
      } catch {
        setUser(null);
        setStaff(null);
      }
    }, []);

  useEffect(() => {
    const initialise = async () => {
      try {
        await refresh();
      } finally {
        setLoading(false);
      }
    };

    void initialise();
  }, [refresh]);

  const login = useCallback(
    async (
      email: string,
      password: string,
    ) => {
      await account.createEmailPasswordSession({
        email,
        password,
      });

      try {
        const currentUser =
          await account.get();

        const councilStaff =
          await getCouncilStaff(
            currentUser.$id,
          );

        setUser(currentUser);
        setStaff(councilStaff);
      } catch (error) {
        try {
          await account.deleteSession({
            sessionId: "current",
          });
        } catch {
          // Ignore cleanup failure.
        }

        setUser(null);
        setStaff(null);

        throw error;
      }
    },
    [],
  );

  const logout = useCallback(
    async () => {
      try {
        await account.deleteSession({
          sessionId: "current",
        });
      } finally {
        setUser(null);
        setStaff(null);
      }
    },
    [],
  );

  const value = useMemo(
    () => ({
      user,
      staff,
      loading,
      login,
      logout,
      refresh,
    }),
    [
      user,
      staff,
      loading,
      login,
      logout,
      refresh,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
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
