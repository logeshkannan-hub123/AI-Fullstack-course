import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../services/authService.js";
import { getErrorMessage } from "../../utils/helpers.js";
import "../../styles/auth.css";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.username.trim()) nextErrors.username = "Username is required";
    else if (form.username.trim().length < 3) nextErrors.username = "Username must be at least 3 characters";

    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!EMAIL_REGEX.test(form.email)) nextErrors.email = "Enter a valid email";

    if (!form.password) nextErrors.password = "Password is required";
    else if (form.password.length < 8) nextErrors.password = "Password must be at least 8 characters";

    return nextErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const { data } = await signup({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      if (!data.success) {
        setServerError(data.message || "Sign up failed.");
        return;
      }

      setSuccessMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { message: "Account created. Please log in." },
        });
      }, 1200);
    } catch (error) {
      setServerError(getErrorMessage(error, "Sign up failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create an account</h2>
        <p className="auth-subtitle">Sign up to start building your movie collection</p>

        {successMessage && <p className="alert alert-success">{successMessage}</p>}
        {serverError && <p className="alert alert-error">{serverError}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className={errors.username ? "has-error" : ""}
              placeholder="yourname"
              autoComplete="username"
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

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
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>


          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
