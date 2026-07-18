import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store";
import { authApi } from "../api";
import { getErrorMessage } from "../api/client";
import type { RegisterCredentials } from "../types";
import { AuthShell } from "../components/AuthShell";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCredentials & { confirmPassword: string }>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (
    data: RegisterCredentials & { confirmPassword: string },
  ) => {
    setError("");
    setLoading(true);
    try {
      const { confirmPassword: _, ...registerData } = data;
      const response = await authApi.register(registerData);
      if (response.data) {
        dispatch(setCredentials(response.data));
        toast.success("Account created successfully");
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
      title="Create account"
      subtitle="Start organizing your tasks in a cleaner workspace"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-300">
            Sign in
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
          <label className="label-text" htmlFor="name">
            Full name
          </label>
          <Input
            id="name"
            error={Boolean(errors.name)}
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
              setValueAs: (value) => value?.trim(),
            })}
          />
          {errors.name ? (
            <p className="helper-text">{errors.name.message}</p>
          ) : null}
        </div>

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
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              setValueAs: (value) => value?.trim(),
            })}
          />
          {errors.password ? (
            <p className="helper-text">{errors.password.message}</p>
          ) : null}
        </div>

        <div>
          <label className="label-text" htmlFor="confirmPassword">
            Confirm password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            error={Boolean(errors.confirmPassword)}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (val, formValues) =>
                (val || "").trim() === (formValues.password || "").trim() ||
                "Passwords do not match",
            })}
          />
          {errors.confirmPassword ? (
            <p className="helper-text">{errors.confirmPassword.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
