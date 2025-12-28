import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your resources, messages, and account."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-xs font-medium text-neutral-700"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-200 bg-white/80 px-3 py-2.5 text-sm text-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/80 focus:border-transparent placeholder:text-neutral-400"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-neutral-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-200 bg-white/80 px-3 py-2.5 text-sm text-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/80 focus:border-transparent placeholder:text-neutral-400"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full inline-flex items-center justify-center rounded-lg bg-linear-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-amber-500/40 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400/80 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="mt-3 text-[11px] text-center text-neutral-500">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-medium text-amber-700 hover:text-amber-800"
          >
            Create one
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
