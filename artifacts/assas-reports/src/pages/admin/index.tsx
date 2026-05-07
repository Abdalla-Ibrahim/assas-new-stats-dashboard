import { useCallback, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, LogOut, Pencil, RefreshCw, Save } from "lucide-react";
import { useCementFactories, type CementFactory } from "@/contexts/FactoriesContext";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

type AdminFactory = CementFactory & {
  isActive?: boolean;
};

type SiteSetting = {
  key: string;
  value: unknown;
  updatedAt?: string;
};

type EditState = {
  bag_price: string;
  bulk_price: string;
  market_share: string;
  capacity: string;
  production: string;
};

const toEditState = (factory: AdminFactory): EditState => ({
  bag_price: String(factory.bagPrice),
  bulk_price: String(factory.bulkPrice),
  market_share: String(factory.marketShare),
  capacity: String(factory.capacity),
  production: String(factory.production2024),
});

function settingToText(value: unknown) {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  return JSON.stringify(value);
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { refetch } = useCementFactories();
  const [factories, setFactories] = useState<AdminFactory[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [settingDrafts, setSettingDrafts] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditState | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("assas_admin_token") : null;

  const authedFetch = useCallback(
    (path: string, init: RequestInit = {}) => {
      if (!token) throw new Error("Missing admin token");
      return fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(init.headers ?? {}),
        },
      });
    },
    [token],
  );

  const loadAdminData = useCallback(async () => {
    if (!token) {
      setLocation("/admin/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [factoryResponse, settingsResponse] = await Promise.all([
        authedFetch("/api/admin/factories"),
        authedFetch("/api/admin/settings"),
      ]);

      if (factoryResponse.status === 401 || settingsResponse.status === 401) {
        localStorage.removeItem("assas_admin_token");
        setLocation("/admin/login");
        return;
      }

      if (!factoryResponse.ok || !settingsResponse.ok) {
        throw new Error("تعذر تحميل بيانات لوحة التحكم");
      }

      const factoryPayload = (await factoryResponse.json()) as { factories: AdminFactory[] };
      const settingsPayload = (await settingsResponse.json()) as { settings: SiteSetting[] };

      setFactories(factoryPayload.factories);
      setSettings(settingsPayload.settings);
      setSettingDrafts(
        Object.fromEntries(settingsPayload.settings.map((setting) => [setting.key, settingToText(setting.value)])),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  }, [authedFetch, setLocation, token]);

  useEffect(() => {
    void loadAdminData();
  }, [loadAdminData]);

  const logout = () => {
    localStorage.removeItem("assas_admin_token");
    setLocation("/admin/login");
  };

  const startEdit = (factory: AdminFactory) => {
    setEditingId(factory.id);
    setEditDraft(toEditState(factory));
    setMessage(null);
    setError(null);
  };

  const saveFactory = async (factoryId: string) => {
    if (!editDraft) return;

    setMessage(null);
    setError(null);

    try {
      const response = await authedFetch(`/api/admin/factories/${factoryId}`, {
        method: "PUT",
        body: JSON.stringify({
          bag_price: Number(editDraft.bag_price),
          bulk_price: Number(editDraft.bulk_price),
          market_share: Number(editDraft.market_share),
          capacity: Number(editDraft.capacity),
          production: Number(editDraft.production),
        }),
      });

      if (!response.ok) {
        throw new Error("تعذر حفظ بيانات المصنع");
      }

      setEditingId(null);
      setEditDraft(null);
      setMessage("تم تحديث بيانات المصنع بنجاح");
      refetch();
      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ البيانات");
    }
  };

  const saveSetting = async (key: string) => {
    setMessage(null);
    setError(null);

    try {
      const response = await authedFetch(`/api/admin/settings/${encodeURIComponent(key)}`, {
        method: "PUT",
        body: JSON.stringify({ value: settingDrafts[key] ?? "" }),
      });

      if (!response.ok) {
        throw new Error("تعذر حفظ الإعداد");
      }

      setMessage("تم تحديث إعدادات الموقع");
      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ الإعداد");
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-secondary/20 bg-slate-900 p-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">Admin Console</p>
            <h1 className="mt-2 text-3xl font-black">لوحة تحكم أساس الإعمار</h1>
            <p className="mt-1 text-sm text-slate-400">إدارة بيانات الأسعار والمصانع وإعدادات منصة مؤشر الإسمنت.</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void loadAdminData()}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
              تحديث
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2 text-sm font-black text-slate-950 hover:bg-secondary/90"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>
          </div>
        </header>

        {message && (
          <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </div>
        )}
        {error && <div className="mb-5 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        <section className="mb-8 overflow-hidden rounded-3xl border border-white/8 bg-slate-900">
          <div className="border-b border-white/8 p-6">
            <h2 className="text-xl font-black">المصانع والأسعار</h2>
            <p className="mt-1 text-sm text-slate-500">تعديل الأسعار يحدث سجل الأسعار ويعيد تحميل بيانات الموقع.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-right text-sm">
              <thead className="bg-white/5 text-xs text-slate-400">
                <tr>
                  {["الاسم", "سعر الكيس", "سعر الطن", "الحصة السوقية", "الطاقة", "الإنتاج", "الحالة", "إجراء"].map((heading) => (
                    <th key={heading} className="px-4 py-3 font-black">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500">جاري تحميل البيانات...</td>
                  </tr>
                ) : (
                  factories.map((factory) => {
                    const isEditing = editingId === factory.id && editDraft;
                    return (
                      <tr key={factory.id} className="border-t border-white/5 hover:bg-white/3">
                        <td className="px-4 py-3">
                          <div className="font-black text-white">{factory.name}</div>
                          <div className="text-xs text-slate-500">{factory.region}</div>
                        </td>
                        {isEditing ? (
                          <>
                            {(["bag_price", "bulk_price", "market_share", "capacity", "production"] as const).map((field) => (
                              <td key={field} className="px-4 py-3">
                                <input
                                  value={editDraft[field]}
                                  onChange={(event) => setEditDraft({ ...editDraft, [field]: event.target.value })}
                                  className="w-24 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-secondary"
                                />
                              </td>
                            ))}
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 font-black text-secondary">{factory.bagPrice.toFixed(2)}</td>
                            <td className="px-4 py-3 font-bold text-white">{factory.bulkPrice}</td>
                            <td className="px-4 py-3">{factory.marketShare}%</td>
                            <td className="px-4 py-3">{factory.capacity}</td>
                            <td className="px-4 py-3">{factory.production2024}</td>
                          </>
                        )}
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${factory.isActive === false ? "bg-red-500/15 text-red-300" : "bg-emerald-500/15 text-emerald-300"}`}>
                            {factory.isActive === false ? "غير نشط" : "نشط"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <button
                              type="button"
                              onClick={() => void saveFactory(factory.id)}
                              className="inline-flex items-center gap-1 rounded-xl bg-secondary px-3 py-2 text-xs font-black text-slate-950"
                            >
                              <Save className="h-3.5 w-3.5" />
                              حفظ
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => startEdit(factory)}
                              className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white hover:bg-white/10"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              تعديل
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-white/8 bg-slate-900 p-6">
          <h2 className="text-xl font-black">إعدادات الموقع</h2>
          <p className="mt-1 text-sm text-slate-500">إعدادات عامة قابلة للتوسع لاحقا لرسائل الحالة ومصدر البيانات.</p>
          <div className="mt-5 space-y-4">
            {settings.length === 0 ? (
              <div className="rounded-2xl border border-white/8 bg-white/3 p-5 text-sm text-slate-500">لا توجد إعدادات محفوظة حاليا.</div>
            ) : (
              settings.map((setting) => (
                <div key={setting.key} className="grid gap-3 rounded-2xl border border-white/8 bg-white/3 p-4 md:grid-cols-[220px_1fr_auto] md:items-center">
                  <div>
                    <p className="font-black text-white">{setting.key}</p>
                    <p className="text-xs text-slate-500">{setting.updatedAt ? `آخر تحديث: ${new Date(setting.updatedAt).toLocaleString("ar-SA")}` : "إعداد عام"}</p>
                  </div>
                  <input
                    value={settingDrafts[setting.key] ?? ""}
                    onChange={(event) => setSettingDrafts((current) => ({ ...current, [setting.key]: event.target.value }))}
                    className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-secondary"
                  />
                  <button
                    type="button"
                    onClick={() => void saveSetting(setting.key)}
                    className="rounded-xl bg-secondary px-4 py-3 text-sm font-black text-slate-950"
                  >
                    حفظ
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
