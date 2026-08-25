"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Oswald } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import blacklogo from "@/assets/blacklogo.png";
import { signIn } from "@/lib/auth-client";

const oswald = Oswald({
  subsets: ["latin"],
});

const initialValues = {
  email: "",
  password: "",
};

const initialTouched = {
  email: false,
  password: false,
};

type FormValues = typeof initialValues;
type TouchedFields = typeof initialTouched;
type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const email = values.email.trim();

  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
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

export default function LoginIndex() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState(initialTouched);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const errors = useMemo(() => validate(values), [values]);
  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([field]) => touched[field as keyof TouchedFields])
  ) as FormErrors;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFormError("");
  };

  const handleBlur = (event: ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  };

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setTouched({
      email: true,
      password: true,
    });
    setFormError("");

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const result = await signIn.email({
        email: values.email.trim(),
        password: values.password,
        callbackURL: "/",
      });

      if (result?.error) {
        setFormError(result.error.message || "Sign in failed. Please try again.");
        return;
      }

      router.replace("/");
    } catch (error) {
      console.error("Email sign in error:", error);
      const message = error instanceof Error ? error.message : "Sign in failed. Please try again.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setFormError("");

    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: "/",
        additionalData: {
          role: "applicant",
        },
      });

      if (result?.error) {
        setFormError(
          result.error.message ||
            "Google sign in is not configured yet. Please add the Google OAuth provider."
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Google sign in is not configured yet. Please add the Google OAuth provider.";
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
              Welcome back
            </span>
            <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-[#1a1a1a] sm:text-5xl lg:leading-[1.1]">
              Sign in to continue your career journey.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-[#1a1a1a]/65">
              Use your email and password to access your profile, or continue
              with Google once OAuth is configured.
            </p>
          </div>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-white/60 bg-[#faf6ec] p-6 shadow-[0_18px_45px_rgba(40,24,8,0.07)] ring-1 ring-[#1a1a1a]/5 backdrop-blur-md sm:p-8">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#1a1a1a]/12 bg-white px-4 text-sm font-semibold text-[#1a1a1a] shadow-[0_2px_8px_rgba(40,24,8,0.04)] transition hover:bg-white/95 hover:border-[#1a1a1a]/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            <FontAwesomeIcon icon={faGoogle} className="h-4 w-4 text-[#ea4335]" />
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-[#1a1a1a]/10" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]/40">
              or
            </span>
            <span className="h-px flex-1 bg-[#1a1a1a]/10" />
          </div>

          <form className="space-y-4" noValidate onSubmit={handleEmailLogin}>
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
                aria-describedby={visibleErrors.password ? "password-error" : undefined}
                autoComplete="current-password"
                className="mt-1.5 h-12 w-full rounded-xl border border-[#1a1a1a]/12 bg-white/80 px-4 text-sm text-[#1a1a1a] outline-none transition placeholder:text-[#1a1a1a]/35 focus:border-[#e2613a] focus:bg-white focus:ring-3 focus:ring-[#e2613a]/15"
                placeholder="Your password"
              />
              <FieldError id="password-error" message={visibleErrors.password} />
            </div>

            {formError ? (
              <p className="rounded-xl border border-[#d93829]/25 bg-[#d93829]/10 px-4 py-3 text-sm font-medium text-[#c42e20]">
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting || isGoogleLoading}
              className="h-12 w-full rounded-xl bg-[#e2613a] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(226,97,58,0.3)] transition hover:bg-[#c9522f] hover:shadow-[0_10px_24px_rgba(226,97,58,0.4)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#1a1a1a]/60">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-[#e2613a] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
