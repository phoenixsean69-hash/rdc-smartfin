import {
  BarChart3,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import {
  FormEvent,
  useState,
} from "react";

import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState(
    "r.moyo@smartpay.local",
  );

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to sign in.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand">
          <div className="login-logo">
            <BarChart3
              size={34}
              strokeWidth={2.2}
            />
          </div>

          <div>
            <strong>SmartPay</strong>
            <span>
              Rural District Council
            </span>
          </div>
        </div>

        <div className="login-brand-copy">
          <span className="login-kicker">
            Council Finance Intelligence
          </span>

          <h1>
            Better revenue.
            <br />
            Better decisions.
          </h1>

          <p>
            Secure financial management,
            revenue intelligence, expenditure
            oversight and AI-assisted council
            decision support.
          </p>
        </div>

        <div className="login-feature-row">
          <div>
            <strong>Revenue</strong>
            <span>
              Collection & arrears
            </span>
          </div>

          <div>
            <strong>Accountability</strong>
            <span>
              Audits & approvals
            </span>
          </div>

          <div>
            <strong>AI</strong>
            <span>
              Forecasts & alerts
            </span>
          </div>
        </div>
      </section>

      <section className="login-form-panel">
        <form
          className="login-card"
          onSubmit={handleSubmit}
        >
          <div className="login-card-heading">
            <span>
              Council staff access
            </span>

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to the SmartPay
              finance portal.
            </p>
          </div>

          <label className="login-field">
            <span>Email address</span>

            <div className="login-input-shell">
              <Mail size={18} />

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label className="login-field">
            <span>Password</span>

            <div className="login-input-shell">
              <LockKeyhole size={18} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (current) => !current,
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </label>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign in to SmartPay"}
          </button>
        </form>
      </section>
    </main>
  );
}
