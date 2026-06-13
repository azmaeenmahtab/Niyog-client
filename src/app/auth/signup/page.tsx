"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Oswald } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import whitelogo from "@/assets/whitelogo.png";
import { signIn, signUp } from "@/lib/auth-client";
import { RoleRadioGroup } from "@/components/RadioGroupRole";

const oswald = Oswald({
  subsets: ["latin"],
});

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const initialRole = "";

const initialTouched = {
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
};

type FormValues = typeof initialValues;
type TouchedFields = typeof initialTouched;
type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[A-Z]/.test(values.password) || !/[0-9]/.test(values.password)) {
    errors.password = "Use at least one uppercase letter and one number.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} className="mt-2 text-sm font-medium text-[#ff7b8d]">
      {message}
    </p>
  );
}

export default function SignupPage() {
  const [values, setValues] = useState(initialValues);
  const [role, setRole] = useState(initialRole);
  const [touched, setTouched] = useState(initialTouched);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [rolechosen, setRoleChosen] = useState(false);
  const [rolewarning, setRoleWarning] = useState("");

  const errors = useMemo(() => validate(values), [values]);
  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([field]) => touched[field as keyof TouchedFields])
  ) as FormErrors;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFormError("");
    setSuccessMessage("");
  };

  const handleBlur = (event: ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  };

  const handleEmailSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    setFormError("");
    setSuccessMessage("");

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const result = await signUp.email({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        callbackURL: "/",
        ...({ role } as Record<string, string>),
      });

      if (result?.error) {
        setFormError(result.error.message || "Signup failed. Please try again.");
        return;
      }

      setSuccessMessage("Account created successfully.");
      setValues(initialValues);
      setRole(initialRole);
      setTouched(initialTouched);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed. Please try again.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!rolechosen) {
      setRoleWarning("Select a role first.");
      return;
    }
    setIsGoogleLoading(true);
    setFormError("");
    setSuccessMessage("");

    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (result?.error) {
        setFormError(
          result.error.message ||
          "Google signup is not configured yet. Please add the Google OAuth provider."
        );
      }
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Google signup is not configured yet. Please add the Google OAuth provider.";
      setFormError(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#050505] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:min-h-[calc(100vh-5rem)] lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-lg">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src={whitelogo} alt="Niyog" className="h-10 w-auto" priority />
            <span
              className={`${oswald.className} text-[32px] font-semibold italic text-white -skew-x-12`}
            >
              Niyog
            </span>
          </Link>

          <div className="mt-12">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7c72ff]">
              Create account
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Start building your career profile.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/55">
              Join Niyog with your email or continue with Google when OAuth is
              connected.
            </p>
          </div>
        </div>

        <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#111111] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.36)] sm:p-8">
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading || isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-white/12 bg-white px-4 text-sm font-semibold text-[#181818] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FontAwesomeIcon icon={faGoogle} className="h-4 w-4" />
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
          </button>
          {rolewarning && (
            <p className="mt-2 text-sm font-medium text-[#ff7b8d]">
              {rolewarning}
            </p>
          )}

          <div className="my-4 flex items-center gap-4">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
              or
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form className="space-y-4" noValidate onSubmit={handleEmailSignup}>
            <div>
              <label htmlFor="name" className="text-sm font-medium text-white/78">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(visibleErrors.name)}
                aria-describedby={visibleErrors.name ? "name-error" : undefined}
                autoComplete="name"
                className="mt-2 h-12 w-full rounded-md border border-white/12 bg-[#0a0a0a] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#7c72ff] focus:ring-3 focus:ring-[#7c72ff]/18"
                placeholder="Your full name"
              />
              <FieldError id="name-error" message={visibleErrors.name} />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium text-white/78">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(visibleErrors.email)}
                aria-describedby={visibleErrors.email ? "email-error" : undefined}
                autoComplete="email"
                className="mt-2 h-12 w-full rounded-md border border-white/12 bg-[#0a0a0a] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#7c72ff] focus:ring-3 focus:ring-[#7c72ff]/18"
                placeholder="you@example.com"
              />
              <FieldError id="email-error" message={visibleErrors.email} />
            </div>

            <div className="text-white">
              <RoleRadioGroup value={role} onChange={(nextRole) => {
                setRole(nextRole);
                setRoleChosen(true);
              }} />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-white/78">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(visibleErrors.password)}
                aria-describedby={
                  visibleErrors.password ? "password-error" : undefined
                }
                autoComplete="new-password"
                className="mt-2 h-12 w-full rounded-md border border-white/12 bg-[#0a0a0a] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#7c72ff] focus:ring-3 focus:ring-[#7c72ff]/18"
                placeholder="Minimum 8 characters"
              />
              <FieldError id="password-error" message={visibleErrors.password} />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-white/78"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(visibleErrors.confirmPassword)}
                aria-describedby={
                  visibleErrors.confirmPassword
                    ? "confirm-password-error"
                    : undefined
                }
                autoComplete="new-password"
                className="mt-2 h-12 w-full rounded-md border border-white/12 bg-[#0a0a0a] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#7c72ff] focus:ring-3 focus:ring-[#7c72ff]/18"
                placeholder="Repeat your password"
              />
              <FieldError
                id="confirm-password-error"
                message={visibleErrors.confirmPassword}
              />
            </div>

            {formError ? (
              <p className="rounded-md border border-[#ff7b8d]/25 bg-[#ff7b8d]/10 px-4 py-3 text-sm font-medium text-[#ff9aaa]">
                {formError}
              </p>
            ) : null}

            {successMessage ? (
              <p className="rounded-md border border-[#66e0a3]/25 bg-[#66e0a3]/10 px-4 py-3 text-sm font-medium text-[#8ff0bd]">
                {successMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting || isGoogleLoading}
              className="h-12 w-full rounded-md bg-linear-to-r from-[#6f62ff] to-[#7a5cff] px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(111,98,255,0.32)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/45">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-[#8c84ff]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
