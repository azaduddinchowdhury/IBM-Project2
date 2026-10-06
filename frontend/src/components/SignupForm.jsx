import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  UserPlus,
} from "lucide-react";

/**
 * SignupForm
 *
 * Props:
 *  onSubmit({ name, email, password, role }) — called when form is valid
 *  isLoading — show "Creating account..." state on the button
 *  errorMessage — optional server/general error string
 *  onSwitchToSignin — callback to switch back to Sign In
 */
const SignupForm = ({
  onSubmit,
  isLoading = false,
  errorMessage = "",
  onSwitchToSignin,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("receptionist");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Errors
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Touched state
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  // ── Validation helpers ────────────────────────────────────────
  const validateName = (val) => {
    if (!val.trim()) return "Full name is required.";
    if (val.trim().length < 2) return "Name must be at least 2 characters.";
    return "";
  };

  const validateEmail = (val) => {
    if (!val.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()))
      return "Please enter a valid email address.";
    return "";
  };

  const validatePassword = (val) => {
    if (!val) return "Password is required.";
    if (val.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const validateConfirmPassword = (val, pwd) => {
    if (!val) return "Please confirm your password.";
    if (val !== pwd) return "Passwords do not match.";
    return "";
  };

  // ── Event Handlers ────────────────────────────────────────────
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (nameTouched) setNameError(validateName(e.target.value));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailTouched) setEmailError(validateEmail(e.target.value));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordTouched) setPasswordError(validatePassword(e.target.value));
    if (confirmTouched)
      setConfirmPasswordError(validateConfirmPassword(confirmPassword, e.target.value));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (confirmTouched)
      setConfirmPasswordError(validateConfirmPassword(e.target.value, password));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setConfirmTouched(true);

    const nErr = validateName(name);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const cpErr = validateConfirmPassword(confirmPassword, password);

    setNameError(nErr);
    setEmailError(eErr);
    setPasswordError(pErr);
    setConfirmPasswordError(cpErr);

    if (nErr || eErr || pErr || cpErr) return;

    onSubmit({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Sign up form">
      {/* General error message from server */}
      {errorMessage && (
        <div className="login-alert error" role="alert">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── Full Name ── */}
      <div className="login-field-group">
        <label htmlFor="signup-name" className="login-field-label">
          Full Name
        </label>
        <div className="login-input-wrap">
          <span className="login-input-icon" aria-hidden="true">
            <User size={17} />
          </span>
          <input
            id="signup-name"
            type="text"
            className={`login-input${nameError && nameTouched ? " field-error" : ""}`}
            placeholder="e.g. Sarah Jenkins"
            value={name}
            onChange={handleNameChange}
            onBlur={() => {
              setNameTouched(true);
              setNameError(validateName(name));
            }}
            autoComplete="name"
            disabled={isLoading}
            aria-describedby={nameError && nameTouched ? "name-error" : undefined}
          />
        </div>
        {nameError && nameTouched && (
          <span id="name-error" className="login-field-error" role="alert">
            <AlertCircle size={13} />
            {nameError}
          </span>
        )}
      </div>

      {/* ── Email Address ── */}
      <div className="login-field-group">
        <label htmlFor="signup-email" className="login-field-label">
          Work Email
        </label>
        <div className="login-input-wrap">
          <span className="login-input-icon" aria-hidden="true">
            <Mail size={17} />
          </span>
          <input
            id="signup-email"
            type="email"
            className={`login-input${emailError && emailTouched ? " field-error" : ""}`}
            placeholder="e.g. sarah@company.com"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => {
              setEmailTouched(true);
              setEmailError(validateEmail(email));
            }}
            autoComplete="email"
            disabled={isLoading}
            aria-describedby={emailError && emailTouched ? "email-error" : undefined}
          />
        </div>
        {emailError && emailTouched && (
          <span id="email-error" className="login-field-error" role="alert">
            <AlertCircle size={13} />
            {emailError}
          </span>
        )}
      </div>

      {/* ── Role Selection ── */}
      <div className="login-field-group">
        <label htmlFor="signup-role" className="login-field-label">
          System Role
        </label>
        <div className="login-input-wrap">
          <span className="login-input-icon" aria-hidden="true">
            <Shield size={17} />
          </span>
          <select
            id="signup-role"
            className="login-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isLoading}
          >
            <option value="receptionist">Receptionist (Check-in / Check-out)</option>
            <option value="admin">Administrator (Full Access)</option>
            <option value="employee">Staff / Employee</option>
          </select>
        </div>
      </div>

      {/* ── Password ── */}
      <div className="login-field-group">
        <label htmlFor="signup-password" className="login-field-label">
          Password
        </label>
        <div className="login-input-wrap">
          <span className="login-input-icon" aria-hidden="true">
            <Lock size={17} />
          </span>
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            className={`login-input${passwordError && passwordTouched ? " field-error" : ""}`}
            placeholder="Minimum 6 characters"
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => {
              setPasswordTouched(true);
              setPasswordError(validatePassword(password));
            }}
            autoComplete="new-password"
            disabled={isLoading}
            aria-describedby={passwordError && passwordTouched ? "password-error" : undefined}
          />
          <button
            type="button"
            className="login-pw-toggle"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
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

      {/* ── Confirm Password ── */}
      <div className="login-field-group" style={{ marginBottom: 28 }}>
        <label htmlFor="signup-confirm-password" className="login-field-label">
          Confirm Password
        </label>
        <div className="login-input-wrap">
          <span className="login-input-icon" aria-hidden="true">
            <Lock size={17} />
          </span>
          <input
            id="signup-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            className={`login-input${confirmPasswordError && confirmTouched ? " field-error" : ""}`}
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onBlur={() => {
              setConfirmTouched(true);
              setConfirmPasswordError(validateConfirmPassword(confirmPassword, password));
            }}
            autoComplete="new-password"
            disabled={isLoading}
            aria-describedby={confirmPasswordError && confirmTouched ? "confirm-error" : undefined}
          />
          <button
            type="button"
            className="login-pw-toggle"
            onClick={() => setShowConfirmPassword((s) => !s)}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {confirmPasswordError && confirmTouched && (
          <span id="confirm-error" className="login-field-error" role="alert">
            <AlertCircle size={13} />
            {confirmPasswordError}
          </span>
        )}
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
            Creating account...
          </>
        ) : (
          <>
            <UserPlus size={18} />
            Create Account
          </>
        )}
      </button>

      {/* ── Switch to Sign In ── */}
      <p className="login-contact-row">
        Already have an account?{" "}
        {onSwitchToSignin && (
          <button
            type="button"
            className="auth-toggle-btn"
            onClick={onSwitchToSignin}
          >
            Sign In
          </button>
        )}
      </p>
    </form>
  );
};

export default SignupForm;
