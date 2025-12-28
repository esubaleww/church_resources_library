import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }
      localStorage.setItem("token", data.token);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Sign up to send messages, save resources, and access your dashboard."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label
            htmlFor="name"
            className="block text-xs font-medium text-neutral-700"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-200 bg-white/80 px-3 py-2.5 text-sm text-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/80 focus:border-transparent placeholder:text-neutral-400"
            placeholder="Abel Kassahun"
          />
        </div>

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
            autoComplete="new-password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-200 bg-white/80 px-3 py-2.5 text-sm text-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/80 focus:border-transparent placeholder:text-neutral-400"
            placeholder="At least 6 characters"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full inline-flex items-center justify-center rounded-lg bg-linear-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-amber-500/40 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400/80 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-3 text-[11px] text-center text-neutral-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-amber-700 hover:text-amber-800"
          >
            Sign in
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
