import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import { authApi } from "../api/axios";
import {
  Building2,
  Users,
  Shield,
  ClipboardList,
  CheckCircle2,
  LogIn,
  UserPlus,
} from "lucide-react";

/**
 * Authentication Page (Login & Register)
 *
 * Props:
 *  onLoginSuccess(userData) — called when user successfully signs in or signs up
 */
const Login = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState("signin"); // "signin" | "signup"
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * handleLogin — sends login credentials to backend API
   */
  const handleLogin = async (email, password, rememberMe) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await authApi.login({ email, password });

      if (response.data && response.data.success) {
        const { token, user } = response.data;

        if (rememberMe) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("user", JSON.stringify(user));
        }

        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      } else {
        setErrorMessage(response.data?.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * handleSignup — creates a new account on the backend API
   */
  const handleSignup = async ({ name, email, password, role }) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await authApi.register({ name, email, password, role });

      if (response.data && response.data.success) {
        const { token, user } = response.data;

        // Automatically sign in upon registration
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      } else {
        setErrorMessage(
          response.data?.message || "Registration failed. Please try again."
        );
      }
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message ||
          "Failed to create account. Please verify your details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* ══════════════════════════════════════
          LEFT — Branding & Illustration Panel
          ══════════════════════════════════════ */}
      <aside className="login-brand-panel" aria-hidden="true">
        <div className="login-brand-content">
          {/* CSS illustration with floating stat badges */}
          <div className="login-illustration">
            <div className="login-illustration-bg">
              <div className="login-illustration-inner">
                <Building2 size={52} className="login-illustration-icon" />
              </div>

              {/* Floating badge – Checked In */}
              <div className="login-badge badge-top">
                <span className="login-badge-dot green" />
                Visitor Checked In
              </div>

              {/* Floating badge – Records */}
              <div className="login-badge badge-bottom">
                <ClipboardList size={13} color="#3b82f6" />
                Records Logged
              </div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="login-brand-heading">
            Employee&nbsp;Visitor
            <br />Management
          </h2>

          <p className="login-brand-sub">
            Manage visitor records securely and efficiently.
            <br />
            Designed for reception staff, admins and employees.
          </p>

          {/* Feature highlights */}
          <ul className="login-features">
            <li className="login-feature-item">
              <span className="login-feature-icon">
                <Users size={14} />
              </span>
              Track every visitor — check-in to check-out
            </li>
            <li className="login-feature-item">
              <span className="login-feature-icon">
                <Shield size={14} />
              </span>
              Secure and role-based access control
            </li>
            <li className="login-feature-item">
              <span className="login-feature-icon">
                <CheckCircle2 size={14} />
              </span>
              Real-time dashboard &amp; status updates
            </li>
            <li className="login-feature-item">
              <span className="login-feature-icon">
                <ClipboardList size={14} />
              </span>
              Complete CRUD visitor record management
            </li>
          </ul>

          <p className="login-brand-footer">
            © {new Date().getFullYear()} VisitorDesk · Internal use only
          </p>
        </div>
      </aside>

      {/* ══════════════════════════════════════
          RIGHT — Auth Form Panel (Sign In & Sign Up)
          ══════════════════════════════════════ */}
      <main className="login-form-panel">
        <div className="login-form-wrapper">
          {/* Logo mark */}
          <div className="login-logo-mark" aria-hidden="true">
            <Building2 size={26} />
          </div>

          <h1 className="login-welcome-heading">
            {authMode === "signin" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="login-welcome-sub">
            {authMode === "signin"
              ? "Sign in to manage your visitor records."
              : "Register an account to start managing visitor records."}
          </p>

          {/* Clean Segmented Tab Toggle between Sign In and Sign Up */}
          <div
            className="auth-mode-toggle"
            role="tablist"
            aria-label="Authentication Options"
          >
            <button
              type="button"
              role="tab"
              aria-selected={authMode === "signin"}
              className={`auth-mode-tab ${authMode === "signin" ? "active" : ""}`}
              onClick={() => {
                setAuthMode("signin");
                setErrorMessage("");
              }}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={authMode === "signup"}
              className={`auth-mode-tab ${authMode === "signup" ? "active" : ""}`}
              onClick={() => {
                setAuthMode("signup");
                setErrorMessage("");
              }}
            >
              <UserPlus size={16} />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Form depending on selected mode */}
          {authMode === "signin" ? (
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onSwitchToSignup={() => {
                setAuthMode("signup");
                setErrorMessage("");
              }}
            />
          ) : (
            <SignupForm
              onSubmit={handleSignup}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onSwitchToSignin={() => {
                setAuthMode("signin");
                setErrorMessage("");
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;
