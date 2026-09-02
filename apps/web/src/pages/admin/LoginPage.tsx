import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { loginSchema, type LoginInput } from "@movers-rwanda/shared";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/api";

export function LoginPage() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  if (admin) {
    const state = location.state as { from?: { pathname?: string } } | null;
    return <Navigate to={state?.from?.pathname ?? "/admin"} replace />;
  }

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      await login(data.email, data.password);
      navigate("/admin");
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <h1>Admin Login</h1>
        <p>Sign in to manage Movers Rwanda leads and content.</p>
        <form className="admin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="username" {...register("email")} />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="current-password" {...register("password")} />
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>
          {serverError && <span className="field-error">{serverError}</span>}
          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
