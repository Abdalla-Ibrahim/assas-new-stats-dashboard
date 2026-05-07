import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation } from "wouter";
import { LockKeyhole, LogIn } from "lucide-react";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("admin@assas.sa");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("بيانات الدخول غير صحيحة");
      }

      const payload = (await response.json()) as { token?: string };
      if (!payload.token) {
        throw new Error("لم يتم استلام رمز الدخول");
      }

      localStorage.setItem("assas_admin_token", payload.token);
      setLocation("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-secondary/25 bg-slate-900 shadow-2xl shadow-black/30">
        <div className="border-b border-white/8 bg-gradient-to-l from-secondary/10 to-transparent p-7">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15">
            <LockKeyhole className="h-6 w-6 text-secondary" />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">Assas Admin</p>
          <h1 className="mt-2 text-2xl font-black">تسجيل دخول لوحة التحكم</h1>
          <p className="mt-2 text-sm text-slate-400">إدارة بيانات مؤشر أسعار الإسمنت السعودي.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-7">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-300">البريد الإلكتروني</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-secondary"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-300">كلمة المرور</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-secondary"
              required
            />
          </label>

          {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary px-5 py-3 font-black text-slate-950 transition hover:bg-secondary/90 disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {isLoading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
