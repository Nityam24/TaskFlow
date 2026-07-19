import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store";
import { authApi } from "../api";
import { getErrorMessage } from "../api/client";
import type { LoginCredentials } from "../types";
import { AuthShell } from "../components/AuthShell";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setError("");
    setLoading(true);
    try {
      const response = await authApi.login(data);
      if (response.data) {
        dispatch(setCredentials(response.data));
        toast.success("Signed in successfully");
        navigate("/tasks");
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue planning your day"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-indigo-300">
            Create one
          </Link>
        </>
      }
    >
      {error ? (
        <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </div>
      ) : null}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="label-text" htmlFor="email">
            Email <span className="text-rose-400">*</span>
          </label>
          <Input
            id="email"
            type="email"
            error={Boolean(errors.email)}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
              setValueAs: (value) => value?.trim(),
            })}
          />
          {errors.email ? (
            <p className="helper-text">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label className="label-text" htmlFor="password">
            Password <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className="pr-16"
              error={Boolean(errors.password)}
              {...register("password", {
                required: "Password is required",
                setValueAs: (value) => value?.trim(),
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6A3 3 0 0 0 13.4 13.4" />
                  <path d="M9.2 5.1A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a18.9 18.9 0 0 1-4.2 5.2" />
                  <path d="M6.7 6.7A18.8 18.8 0 0 0 2 12s3.5 7 10 7a10.8 10.8 0 0 0 3.3-.5" />
                </svg>
              )}
            </button>
          </div>
          {errors.password ? (
            <p className="helper-text">{errors.password.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
