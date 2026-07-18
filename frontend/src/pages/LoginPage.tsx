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
            Email
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
            Password
          </label>
          <Input
            id="password"
            type="password"
            error={Boolean(errors.password)}
            {...register("password", {
              required: "Password is required",
              setValueAs: (value) => value?.trim(),
            })}
          />
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
