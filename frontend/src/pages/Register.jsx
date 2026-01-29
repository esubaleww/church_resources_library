import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (form.name.trim().length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(form.name.trim())) {
      newErrors.name =
        "Name can only contain letters, spaces, and basic punctuation";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    } else if (form.email.trim().length > 255) {
      newErrors.email = "Email is too long";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (form.password.length > 100) {
      newErrors.password = "Password must be less than 100 characters";
    } else if (!/(?=.*[a-zA-Z])/.test(form.password)) {
      newErrors.password = "Password must contain at least one letter";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    const weakPasswords = [
      "password",
      "123456",
      "qwerty",
      "abc123",
      "password123",
      "admin",
      "letmein",
      "welcome",
      "monkey",
      "123456789",
    ];
    if (weakPasswords.includes(form.password.toLowerCase())) {
      newErrors.password =
        "This password is too common. Please choose a stronger one.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /alert\(/i,
        /eval\(/i,
        /union\s+select/i,
        /select.+from/i,
        /insert.+into/i,
        /delete.+from/i,
        /drop\s+table/i,
      ];

      for (const pattern of suspiciousPatterns) {
        if (
          pattern.test(form.name) ||
          pattern.test(form.email) ||
          pattern.test(form.password)
        ) {
          toast.error("Invalid input detected.");
          setLoading(false);
          return;
        }
      }

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (
          data.message?.includes("already exists") ||
          data.message?.includes("duplicate")
        ) {
          toast.error("An account with this email already exists.");
        } else if (data.message?.includes("invalid email")) {
          toast.error("Please enter a valid email address.");
        } else if (data.message?.includes("password")) {
          toast.error("Password requirements not met.");
        } else {
          toast.error(data.message || "Registration failed.");
        }
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("registration_success", "true");

      toast.success("Account created successfully. You can now sign in.");

      navigate("/login");
    } catch (err) {
      toast.error("Could not complete registration. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Sign up to send messages, save resources, and access your dashboard."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Top-level API errors now shown via toast, so no inline error box */}

        <div className="space-y-1">
          <div className="flex justify-between">
            <label
              htmlFor="name"
              className="block text-xs font-medium text-neutral-700"
            >
              Full name
            </label>
            {errors.name && (
              <span className="text-xs text-red-600 animate-fadeIn">
                {errors.name}
              </span>
            )}
          </div>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.name
                ? "border-red-300 focus:ring-red-200"
                : "border-neutral-200 focus:ring-amber-500/80"
            } bg-white/80 px-3 py-2.5 text-sm text-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-neutral-400 transition-colors`}
            placeholder="Abel Kassahun"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-neutral-700"
            >
              Email address
            </label>
            {errors.email && (
              <span className="text-xs text-red-600 animate-fadeIn">
                {errors.email}
              </span>
            )}
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.email
                ? "border-red-300 focus:ring-red-200"
                : "border-neutral-200 focus:ring-amber-500/80"
            } bg-white/80 px-3 py-2.5 text-sm text-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-neutral-400 transition-colors`}
            placeholder="you@example.com"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-neutral-700"
            >
              Password
            </label>
            {errors.password && (
              <span className="text-xs text-red-600 animate-fadeIn">
                {errors.password}
              </span>
            )}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.password
                ? "border-red-300 focus:ring-red-200"
                : "border-neutral-200 focus:ring-amber-500/80"
            } bg-white/80 px-3 py-2.5 text-sm text-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-neutral-400 transition-colors`}
            placeholder="At least 6 characters with letters"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <p className="text-[10px] text-neutral-500 mt-1">
            Tip: Use a mix of letters, numbers, and symbols for better security
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-medium text-neutral-700"
            >
              Confirm Password
            </label>
            {errors.confirmPassword && (
              <span className="text-xs text-red-600 animate-fadeIn">
                {errors.confirmPassword}
              </span>
            )}
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.confirmPassword
                ? "border-red-300 focus:ring-red-200"
                : "border-neutral-200 focus:ring-amber-500/80"
            } bg-white/80 px-3 py-2.5 text-sm text-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-neutral-400 transition-colors`}
            placeholder="Re-enter your password"
            aria-invalid={errors.confirmPassword ? "true" : "false"}
            aria-describedby={
              errors.confirmPassword ? "confirm-password-error" : undefined
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full inline-flex items-center justify-center rounded-lg bg-linear-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-amber-500/40 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400/80 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>

        <p className="mt-3 text-[11px] text-center text-neutral-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-amber-700 hover:text-amber-800 transition-colors"
          >
            Sign in
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
