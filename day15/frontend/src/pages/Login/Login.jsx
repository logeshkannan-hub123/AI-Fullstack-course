import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login as loginRequest } from "../../services/authService.js";
import { useAuth } from "../../hooks/useAuth.js";
import { getErrorMessage } from "../../utils/helpers.js";
import "../../styles/auth.css";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const infoMessage = location.state?.message;
  const redirectTo = location.state?.from?.pathname || "/movies";

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!EMAIL_REGEX.test(form.email)) nextErrors.email = "Enter a valid email";
    if (!form.password) nextErrors.password = "Password is required";
    return nextErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const { data } = await loginRequest(form);
      if (!data.success) {
        setServerError(data.message || "Login failed.");
        return;
      }
      login(data.token, data.user);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setServerError(getErrorMessage(error, "Login failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Log in to manage your movie collection</p>

        {infoMessage && <p className="alert alert-success">{infoMessage}</p>}
        {serverError && <p className="alert alert-error">{serverError}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "has-error" : ""}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? "has-error" : ""}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
