"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Oswald } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import blacklogo from "@/assets/blacklogo.png";
import { signIn, signUp } from "@/lib/auth-client";
import { RoleRadioGroup } from "@/components/RadioGroupRole";
import { updateUserRole } from "@/lib/api/user";

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
    <p id={id} className="mt-1.5 text-xs font-medium text-[#c42e20]">
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
  const [signUpMethod, setSignUpMethod] = useState<"email" | "google">("email");

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
    setSignUpMethod("email");

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
    setSignUpMethod("google");
    setIsGoogleLoading(true);
    setFormError("");
    setSuccessMessage("");

    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: "/",
        additionalData: {
          role: role,
        },
      });

      localStorage.setItem("pendingRole", role);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Google signup is not configured yet. Please add the Google OAuth provider.";
      setFormError(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#f3ede2] px-4 py-10 text-[#1a1a1a] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:min-h-[calc(100vh-5rem)] lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-lg">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <Image src={blacklogo} alt="Niyog" className="h-10 w-auto transition-transform group-hover:scale-105" priority />
            <span
              className={`${oswald.className} text-[32px] font-semibold italic text-[#e2613a] -skew-x-12`}
            >
              Niyog
            </span>
          </Link>

          <div className="mt-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/60 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#e2613a] shadow-[0_4px_16px_rgba(40,24,8,0.04)] backdrop-blur-md">
              Create account
            </span>
            <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-[#1a1a1a] sm:text-5xl lg:leading-[1.1]">
              Start building your career profile.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-[#1a1a1a]/65">
              Join Niyog with your email or continue with Google when OAuth is
              connected.
            </p>
          </div>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-white/60 bg-[#faf6ec] p-6 shadow-[0_18px_45px_rgba(40,24,8,0.07)] ring-1 ring-[#1a1a1a]/5 backdrop-blur-md sm:p-8">
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading || isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#1a1a1a]/12 bg-white px-4 text-sm font-semibold text-[#1a1a1a] shadow-[0_2px_8px_rgba(40,24,8,0.04)] transition hover:bg-white/95 hover:border-[#1a1a1a]/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            <FontAwesomeIcon icon={faGoogle} className="h-4 w-4 text-[#ea4335]" />
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
          </button>
          {rolewarning && (
            <p className="mt-2 text-xs font-medium text-[#c42e20]">
              {rolewarning}
            </p>
          )}

          <div className="my-4 flex items-center gap-4">
            <span className="h-px flex-1 bg-[#1a1a1a]/10" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]/40">
              or
            </span>
            <span className="h-px flex-1 bg-[#1a1a1a]/10" />
          </div>

          <form className="space-y-4" noValidate onSubmit={handleEmailSignup}>
            <div>
              <label htmlFor="name" className="text-sm font-medium text-[#1a1a1a]/80">
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
                className="mt-1.5 h-12 w-full rounded-xl border border-[#1a1a1a]/12 bg-white/80 px-4 text-sm text-[#1a1a1a] outline-none transition placeholder:text-[#1a1a1a]/35 focus:border-[#e2613a] focus:bg-white focus:ring-3 focus:ring-[#e2613a]/15"
                placeholder="Your full name"
              />
              <FieldError id="name-error" message={visibleErrors.name} />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium text-[#1a1a1a]/80">
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
                className="mt-1.5 h-12 w-full rounded-xl border border-[#1a1a1a]/12 bg-white/80 px-4 text-sm text-[#1a1a1a] outline-none transition placeholder:text-[#1a1a1a]/35 focus:border-[#e2613a] focus:bg-white focus:ring-3 focus:ring-[#e2613a]/15"
                placeholder="you@example.com"
              />
              <FieldError id="email-error" message={visibleErrors.email} />
            </div>

            <div>
              <RoleRadioGroup
                value={role}
                onChange={(nextRole) => {
                  setRole(nextRole);
                  setRoleChosen(true);
                  setRoleWarning("");
                }}
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-[#1a1a1a]/80">
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
                className="mt-1.5 h-12 w-full rounded-xl border border-[#1a1a1a]/12 bg-white/80 px-4 text-sm text-[#1a1a1a] outline-none transition placeholder:text-[#1a1a1a]/35 focus:border-[#e2613a] focus:bg-white focus:ring-3 focus:ring-[#e2613a]/15"
                placeholder="Minimum 8 characters"
              />
              <FieldError id="password-error" message={visibleErrors.password} />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-[#1a1a1a]/80"
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
                className="mt-1.5 h-12 w-full rounded-xl border border-[#1a1a1a]/12 bg-white/80 px-4 text-sm text-[#1a1a1a] outline-none transition placeholder:text-[#1a1a1a]/35 focus:border-[#e2613a] focus:bg-white focus:ring-3 focus:ring-[#e2613a]/15"
                placeholder="Repeat your password"
              />
              <FieldError
                id="confirm-password-error"
                message={visibleErrors.confirmPassword}
              />
            </div>

            {formError ? (
              <p className="rounded-xl border border-[#d93829]/25 bg-[#d93829]/10 px-4 py-3 text-sm font-medium text-[#c42e20]">
                {formError}
              </p>
            ) : null}

            {successMessage ? (
              <p className="rounded-xl border border-[#1b8a5a]/25 bg-[#1b8a5a]/10 px-4 py-3 text-sm font-medium text-[#166e48]">
                {successMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting || isGoogleLoading}
              className="h-12 w-full rounded-xl bg-[#e2613a] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(226,97,58,0.3)] transition hover:bg-[#c9522f] hover:shadow-[0_10px_24px_rgba(226,97,58,0.4)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#1a1a1a]/60">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-[#e2613a] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
