import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, LogIn } from "lucide-react";

/**
 * LoginForm
 *
 * Props:
 *  onSubmit(email, password, rememberMe) — called when form is valid
 *  isLoading — show "Signing in..." state on the button
 *  errorMessage — optional server/general error string to show above the button
 */
const LoginForm = ({
  onSubmit,
  isLoading = false,
  errorMessage = "",
  onSwitchToSignup,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Per-field error messages
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Touch tracking — show errors only after field is touched
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // ── Validation helpers ────────────────────────────────────────
  const validateEmail = (value) => {
    if (!value.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
      return "Please enter a valid email address.";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required.";
    return "";
  };

  // ── Event handlers ────────────────────────────────────────────
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailTouched) setEmailError(validateEmail(e.target.value));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordTouched) setPasswordError(validatePassword(e.target.value));
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setPasswordError(validatePassword(password));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark both touched so errors appear
    setEmailTouched(true);
    setPasswordTouched(true);

    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr || pErr) return; // Stop if invalid

    onSubmit(email.trim(), password, rememberMe);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Placeholder — wire up later when authentication is implemented
    alert("Please contact your system administrator to reset your password.");
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Sign in form">

      {/* General error (e.g. wrong credentials from server) */}
      {errorMessage && (
        <div className="login-alert error" role="alert">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── Email ── */}
      <div className="login-field-group">
        <label htmlFor="login-email" className="login-field-label">
          Email Address
        </label>
        <div className="login-input-wrap">
          <span className="login-input-icon" aria-hidden="true">
            <Mail size={17} />
          </span>
          <input
            id="login-email"
            type="email"
            className={`login-input${emailError && emailTouched ? " field-error" : ""}`}
            placeholder="Enter your email address"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            autoComplete="email"
            disabled={isLoading}
            aria-describedby={emailError && emailTouched ? "email-error" : undefined}
            aria-invalid={!!(emailError && emailTouched)}
          />
        </div>
        {emailError && emailTouched && (
          <span id="email-error" className="login-field-error" role="alert">
            <AlertCircle size={13} />
            {emailError}
          </span>
        )}
      </div>

      {/* ── Password ── */}
      <div className="login-field-group">
        <label htmlFor="login-password" className="login-field-label">
          Password
        </label>
        <div className="login-input-wrap">
          <span className="login-input-icon" aria-hidden="true">
            <Lock size={17} />
          </span>
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            className={`login-input${passwordError && passwordTouched ? " field-error" : ""}`}
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            autoComplete="current-password"
            disabled={isLoading}
            aria-describedby={passwordError && passwordTouched ? "password-error" : undefined}
            aria-invalid={!!(passwordError && passwordTouched)}
          />
          <button
            type="button"
            className="login-pw-toggle"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={0}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {passwordError && passwordTouched && (
          <span id="password-error" className="login-field-error" role="alert">
            <AlertCircle size={13} />
            {passwordError}
          </span>
        )}
      </div>

      {/* ── Remember Me + Forgot Password ── */}
      <div className="login-options-row">
        <label className="login-remember-label">
          <input
            type="checkbox"
            className="login-remember-checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
          Remember me
        </label>

        <button
          type="button"
          className="login-forgot-link"
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </button>
      </div>

      {/* ── Submit Button ── */}
      <button
        type="submit"
        className="login-submit-btn"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <span className="login-btn-spinner" aria-hidden="true" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn size={18} />
            Sign In
          </>
        )}
      </button>

      {/* ── Switch to Sign Up ── */}
      <p className="login-contact-row">
        Don&apos;t have an account?{" "}
        {onSwitchToSignup ? (
          <button
            type="button"
            className="auth-toggle-btn"
            onClick={onSwitchToSignup}
          >
            Sign Up
          </button>
        ) : (
          <strong>Contact your administrator</strong>
        )}
      </p>
    </form>
  );
};

export default LoginForm;
