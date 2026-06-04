import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, History, LogOut, MapPinned, Pencil, Plus, RefreshCw, Save, Trash2, Truck } from "lucide-react";
import { useCementFactories, type CementFactory } from "@/contexts/FactoriesContext";
import {
  DEFAULT_MAP_DISPLAY_SETTINGS,
  HEATMAP_METRIC_OPTIONS,
  MAP_DISPLAY_SETTINGS_KEY,
  REGION_OPTIONS,
  type MapDisplaySettings,
  normalizeMapDisplaySettings,
} from "@/data/mapSettings";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

const getAdminToken = () => (typeof window !== "undefined" ? localStorage.getItem("assas_admin_token") : null);

type AdminFactory = CementFactory & {
  isActive?: boolean;
};

type SiteSetting = {
  key: string;
  value: unknown;
  updatedAt?: string;
};

type ShippingCost = {
  id: string;
  originRegionId: string;
  destinationRegionId: string;
  productType: string;
  truckType: string;
  costPerTon: number;
  minimumCharge: number;
  currency: string;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  effectiveFrom?: string;
  effectiveTo?: string | null;
  isActive: boolean;
  notes?: string | null;
};

type EditState = {
  id?: string;
  name_ar: string;
  name_en: string;
  bag_price: string;
  bulk_price: string;
  market_share: string;
  capacity: string;
  production: string;
  region_id: string;
  region: string;
  color: string;
  listed: boolean;
  stock_price: string;
  stock_change: string;
  stock_change_pct: string;
  stock_symbol: string;
  founded: string;
  employees: string;
  is_active: boolean;
};

type ChangeLogEntry = {
  id: string;
  timestamp: string;
  entityType: string;
  entityId: string;
  action: string;
  factoryName: string | null;
  field: string;
  oldValue: string;
  newValue: string;
};

type MapEditState = {
  region_id: string;
  region: string;
  color: string;
  is_active: boolean;
};

type ShippingEditState = {
  origin_region_id: string;
  destination_region_id: string;
  product_type: string;
  truck_type: string;
  cost_per_ton: string;
  minimum_charge: string;
  delivery_days_min: string;
  delivery_days_max: string;
  is_active: boolean;
  notes: string;
};

const toEditState = (factory: AdminFactory): EditState => ({
  id: factory.id,
  name_ar: factory.name,
  name_en: factory.shortName,
  bag_price: String(factory.bagPrice),
  bulk_price: String(factory.bulkPrice),
  market_share: String(factory.marketShare),
  capacity: String(factory.capacity),
  production: String(factory.production2024),
  region_id: factory.regionId,
  region: factory.region,
  color: factory.color,
  listed: factory.listed,
  stock_price: String(factory.stockPrice),
  stock_change: String(factory.change),
  stock_change_pct: String(factory.changePct),
  stock_symbol: factory.symbol === "خاص" ? "" : factory.symbol,
  founded: String(factory.founded),
  employees: String(factory.employees),
  is_active: factory.isActive !== false,
});

const newFactoryDraft = (): EditState => ({
  id: "",
  name_ar: "",
  name_en: "",
  bag_price: "",
  bulk_price: "",
  market_share: "0",
  capacity: "0",
  production: "0",
  region_id: "riyadh",
  region: regionName("riyadh"),
  color: "#f5b800",
  listed: false,
  stock_price: "0",
  stock_change: "0",
  stock_change_pct: "0",
  stock_symbol: "",
  founded: String(new Date().getFullYear()),
  employees: "0",
  is_active: true,
});

const factoryPayloadFromDraft = (draft: EditState) => ({
  id: draft.id?.trim(),
  name_ar: draft.name_ar,
  name_en: draft.name_en || draft.name_ar,
  bag_price: Number(draft.bag_price),
  bulk_price: Number(draft.bulk_price),
  market_share: Number(draft.market_share),
  capacity: Number(draft.capacity),
  production: Number(draft.production),
  region_id: draft.region_id,
  region: draft.region,
  color: draft.color,
  listed: draft.listed,
  stock_price: Number(draft.stock_price),
  stock_change: Number(draft.stock_change),
  stock_change_pct: Number(draft.stock_change_pct),
  stock_symbol: draft.stock_symbol || null,
  founded: Number(draft.founded),
  employees: Number(draft.employees),
  is_active: draft.is_active,
});

const toMapEditState = (factory: AdminFactory): MapEditState => ({
  region_id: factory.regionId,
  region: factory.region,
  color: factory.color,
  is_active: factory.isActive !== false,
});

const toShippingEditState = (route: ShippingCost): ShippingEditState => ({
  origin_region_id: route.originRegionId,
  destination_region_id: route.destinationRegionId,
  product_type: route.productType,
  truck_type: route.truckType,
  cost_per_ton: String(route.costPerTon),
  minimum_charge: String(route.minimumCharge),
  delivery_days_min: String(route.deliveryDaysMin),
  delivery_days_max: String(route.deliveryDaysMax),
  is_active: route.isActive,
  notes: route.notes ?? "",
});

function settingToText(value: unknown) {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  return JSON.stringify(value);
}

function regionName(regionId: string) {
  return REGION_OPTIONS.find((region) => region.id === regionId)?.name ?? regionId;
}

function isHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { refetch } = useCementFactories();
  const [factories, setFactories] = useState<AdminFactory[]>([]);
  const [shippingCosts, setShippingCosts] = useState<ShippingCost[]>([]);
  const [changeLog, setChangeLog] = useState<ChangeLogEntry[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [settingDrafts, setSettingDrafts] = useState<Record<string, string>>({});
  const [mapSettingsDraft, setMapSettingsDraft] = useState<MapDisplaySettings>(DEFAULT_MAP_DISPLAY_SETTINGS);
  const [isCreatingFactory, setIsCreatingFactory] = useState(false);
  const [newFactory, setNewFactory] = useState<EditState>(newFactoryDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditState | null>(null);
  const [mapEditingId, setMapEditingId] = useState<string | null>(null);
  const [mapEditDraft, setMapEditDraft] = useState<MapEditState | null>(null);
  const [shippingEditingId, setShippingEditingId] = useState<string | null>(null);
  const [shippingEditDraft, setShippingEditDraft] = useState<ShippingEditState | null>(null);
  const [matrixProductType, setMatrixProductType] = useState("bulk");
  const [matrixTruckType, setMatrixTruckType] = useState("tanker");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savingFactoryId, setSavingFactoryId] = useState<string | null>(null);

  const token = getAdminToken();

  const authedFetch = useCallback(
    (path: string, init: RequestInit = {}) => {
      const currentToken = getAdminToken();
      if (!currentToken) throw new Error("Missing admin token");
      return fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
          ...(init.headers ?? {}),
        },
      });
    },
    [],
  );

  const loadAdminData = useCallback(async () => {
    if (!token) {
      setLocation("/admin/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [factoryResponse, settingsResponse, shippingResponse, changeLogResponse] = await Promise.all([
        authedFetch("/api/admin/factories"),
        authedFetch("/api/admin/settings"),
        authedFetch("/api/admin/shipping-costs"),
        authedFetch("/api/admin/changelog?limit=50"),
      ]);

      if (
        factoryResponse.status === 401 ||
        settingsResponse.status === 401 ||
        shippingResponse.status === 401 ||
        changeLogResponse.status === 401
      ) {
        localStorage.removeItem("assas_admin_token");
        setLocation("/admin/login");
        return;
      }

      if (!factoryResponse.ok || !settingsResponse.ok || !shippingResponse.ok || !changeLogResponse.ok) {
        throw new Error("تعذر تحميل بيانات لوحة التحكم");
      }

      const factoryPayload = (await factoryResponse.json()) as { factories: AdminFactory[] };
      const settingsPayload = (await settingsResponse.json()) as { settings: SiteSetting[] };
      const shippingPayload = (await shippingResponse.json()) as { shippingCosts: ShippingCost[] };
      const changeLogPayload = (await changeLogResponse.json()) as { changes: ChangeLogEntry[] };

      setFactories(factoryPayload.factories);
      setShippingCosts(shippingPayload.shippingCosts);
      setChangeLog(changeLogPayload.changes);
      setSettings(settingsPayload.settings);
      setSettingDrafts(
        Object.fromEntries(settingsPayload.settings.map((setting) => [setting.key, settingToText(setting.value)])),
      );
      setMapSettingsDraft(
        normalizeMapDisplaySettings(
          settingsPayload.settings.find((setting) => setting.key === MAP_DISPLAY_SETTINGS_KEY)?.value,
        ),
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

  const renderFactoryForm = (draft: EditState, onChange: (patch: Partial<EditState>) => void, includeId: boolean) => {
    const textFields = [
      ...(includeId ? ([["id", "Factory ID"]] as const) : []),
      ["name_ar", "Arabic name"],
      ["name_en", "English name"],
      ["bag_price", "Bag price"],
      ["bulk_price", "Bulk price"],
      ["market_share", "Market share"],
      ["capacity", "Capacity"],
      ["production", "Production"],
      ["stock_price", "Stock price"],
      ["stock_change", "Stock change"],
      ["stock_change_pct", "Stock change %"],
      ["stock_symbol", "Stock symbol"],
      ["founded", "Founded"],
      ["employees", "Employees"],
      ["color", "Color"],
      ["region", "Region label"],
    ] as const;

    return (
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
        {textFields.map(([field, label]) => (
          <label key={field} className="block">
            <span className="mb-1 block text-xs font-bold text-slate-400">{label}</span>
            <input
              value={draft[field] ?? ""}
              onChange={(event) => onChange({ [field]: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-secondary"
            />
          </label>
        ))}
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-slate-400">Region</span>
          <select
            value={draft.region_id}
            onChange={(event) => {
              const nextRegionId = event.target.value;
              onChange({ region_id: nextRegionId, region: regionName(nextRegionId) });
            }}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-secondary"
          >
            {REGION_OPTIONS.map((region) => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950 px-3 py-2">
          <span className="text-sm font-bold text-white">Listed</span>
          <input
            type="checkbox"
            checked={draft.listed}
            onChange={(event) => onChange({ listed: event.target.checked })}
            className="h-5 w-5 accent-secondary"
          />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950 px-3 py-2">
          <span className="text-sm font-bold text-white">Active</span>
          <input
            type="checkbox"
            checked={draft.is_active}
            onChange={(event) => onChange({ is_active: event.target.checked })}
            className="h-5 w-5 accent-secondary"
          />
        </label>
      </div>
    );
  };

  const startEdit = (factory: AdminFactory) => {
    setEditingId(factory.id);
    setEditDraft(toEditState(factory));
    setMessage(null);
    setError(null);
  };

  const startMapEdit = (factory: AdminFactory) => {
    setMapEditingId(factory.id);
    setMapEditDraft(toMapEditState(factory));
    setMessage(null);
    setError(null);
  };

  const startShippingEdit = (route: ShippingCost) => {
    setShippingEditingId(route.id);
    setShippingEditDraft(toShippingEditState(route));
    setMessage(null);
    setError(null);
  };

  const startNewShippingRoute = () => {
    setShippingEditingId("new");
    setShippingEditDraft({
      origin_region_id: "riyadh",
      destination_region_id: "makkah",
      product_type: "bulk",
      truck_type: "tanker",
      cost_per_ton: "45",
      minimum_charge: "450",
      delivery_days_min: "1",
      delivery_days_max: "3",
      is_active: true,
      notes: "",
    });
    setMessage(null);
    setError(null);
  };

  const startShippingCellEdit = (originRegionId: string, destinationRegionId: string) => {
    const route = shippingRouteMap.get(`${originRegionId}:${destinationRegionId}`);
    setShippingEditingId(`${originRegionId}:${destinationRegionId}`);
    setShippingEditDraft({
      origin_region_id: originRegionId,
      destination_region_id: destinationRegionId,
      product_type: matrixProductType,
      truck_type: matrixTruckType,
      cost_per_ton: route ? String(route.costPerTon) : "",
      minimum_charge: route ? String(route.minimumCharge) : "0",
      delivery_days_min: route ? String(route.deliveryDaysMin) : "1",
      delivery_days_max: route ? String(route.deliveryDaysMax) : "3",
      is_active: route?.isActive ?? true,
      notes: route?.notes ?? "",
    });
    setMessage(null);
    setError(null);
  };

  const saveFactory = async (factoryId: string) => {
    if (!editDraft) return;

    setMessage(null);
    setError(null);
    setSavingFactoryId(factoryId);

    try {
      const payload = factoryPayloadFromDraft(editDraft);
      const response = await authedFetch(`/api/admin/factories/${factoryId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const responsePayload = (await response.json()) as { factory?: AdminFactory; error?: string };

      if (!response.ok) {
        throw new Error(responsePayload.error ?? "تعذر حفظ بيانات المصنع");
      }

      if (!responsePayload.factory) {
        throw new Error("تعذر قراءة بيانات المصنع بعد الحفظ");
      }

      setFactories((current) =>
        current.map((factory) => (factory.id === factoryId ? responsePayload.factory as AdminFactory : factory)),
      );
      setEditingId(null);
      setEditDraft(null);
      setMessage("تم تحديث بيانات المصنع بنجاح");
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ البيانات");
    } finally {
      setSavingFactoryId(null);
    }
  };

  const createFactory = async () => {
    setMessage(null);
    setError(null);

    if (!newFactory.id?.trim() || !newFactory.name_ar.trim()) {
      setError("Factory ID and Arabic name are required.");
      return;
    }

    if (!isHexColor(newFactory.color)) {
      setError("Factory color must use HEX format, for example #f5b800.");
      return;
    }

    try {
      const response = await authedFetch("/api/admin/factories", {
        method: "POST",
        body: JSON.stringify(factoryPayloadFromDraft(newFactory)),
      });

      if (!response.ok) {
        throw new Error("Unable to create factory.");
      }

      setNewFactory(newFactoryDraft());
      setIsCreatingFactory(false);
      setMessage("Factory created successfully.");
      refetch();
      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create factory.");
    }
  };

  const deactivateFactory = async (factory: AdminFactory) => {
    setMessage(null);
    setError(null);

    try {
      const response = await authedFetch(`/api/admin/factories/${factory.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to deactivate factory.");
      }

      setMessage("Factory deactivated successfully.");
      refetch();
      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to deactivate factory.");
    }
  };

  const saveMapFactory = async (factoryId: string) => {
    if (!mapEditDraft) return;

    setMessage(null);
    setError(null);

    if (!isHexColor(mapEditDraft.color)) {
      setError("لون المصنع يجب أن يكون بصيغة HEX مثل #f5b800");
      return;
    }

    try {
      const response = await authedFetch(`/api/admin/factories/${factoryId}`, {
        method: "PUT",
        body: JSON.stringify({
          region_id: mapEditDraft.region_id,
          region: mapEditDraft.region,
          color: mapEditDraft.color,
          is_active: mapEditDraft.is_active,
        }),
      });

      if (!response.ok) {
        throw new Error("تعذر حفظ إعدادات الخريطة للمصنع");
      }

      setMapEditingId(null);
      setMapEditDraft(null);
      setMessage("تم تحديث إعدادات الخريطة للمصنع بنجاح");
      refetch();
      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ إعدادات الخريطة");
    }
  };

  const saveShippingRoute = async () => {
    if (!shippingEditDraft || !shippingEditingId) return;

    setMessage(null);
    setError(null);

    try {
      const existingRoute = shippingCosts.find(
        (item) =>
          item.originRegionId === shippingEditDraft.origin_region_id &&
          item.destinationRegionId === shippingEditDraft.destination_region_id &&
          item.productType === shippingEditDraft.product_type &&
          item.truckType === shippingEditDraft.truck_type,
      );
      const payload = {
        origin_region_id: shippingEditDraft.origin_region_id,
        destination_region_id: shippingEditDraft.destination_region_id,
        product_type: shippingEditDraft.product_type,
        truck_type: shippingEditDraft.truck_type,
        cost_per_ton: Number(shippingEditDraft.cost_per_ton),
        minimum_charge: Number(shippingEditDraft.minimum_charge),
        delivery_days_min: Number(shippingEditDraft.delivery_days_min),
        delivery_days_max: Number(shippingEditDraft.delivery_days_max),
        is_active: shippingEditDraft.is_active,
        notes: shippingEditDraft.notes || "Updated from admin shipping matrix.",
      };
      const response = await authedFetch(
        existingRoute ? `/api/admin/shipping-costs/${existingRoute.id}` : "/api/admin/shipping-costs",
        {
          method: existingRoute ? "PUT" : "POST",
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("تعذر حفظ مسار الشحن");
      }

      setShippingEditingId(null);
      setShippingEditDraft(null);
      setMessage("تم تحديث مصفوفة الشحن بنجاح");
      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ مسار الشحن");
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

  const saveMapSettings = async () => {
    setMessage(null);
    setError(null);

    try {
      const response = await authedFetch(`/api/admin/settings/${MAP_DISPLAY_SETTINGS_KEY}`, {
        method: "PUT",
        body: JSON.stringify({ value: mapSettingsDraft }),
      });

      if (!response.ok) {
        throw new Error("تعذر حفظ إعدادات الخريطة");
      }

      setMessage("تم تحديث إعدادات الخريطة العامة");
      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ إعدادات الخريطة");
    }
  };

  const generalSettings = settings.filter((setting) => setting.key !== MAP_DISPLAY_SETTINGS_KEY);
  const regionalSummary = REGION_OPTIONS.map((region) => {
    const regionFactories = factories.filter((factory) => factory.regionId === region.id && factory.isActive !== false);
    return {
      ...region,
      count: regionFactories.length,
      capacity: regionFactories.reduce((sum, factory) => sum + factory.capacity, 0),
      production: regionFactories.reduce((sum, factory) => sum + factory.production2024, 0),
    };
  });

  const shippingRouteMap = useMemo(() => {
    const routes = new Map<string, ShippingCost>();
    shippingCosts
      .filter((route) => route.productType === matrixProductType && route.truckType === matrixTruckType)
      .forEach((route) => {
        routes.set(`${route.originRegionId}:${route.destinationRegionId}`, route);
      });
    return routes;
  }, [matrixProductType, matrixTruckType, shippingCosts]);

  const shippingMatrixSummary = useMemo(() => {
    let active = 0;
    let missing = 0;
    let needsUpdate = 0;

    REGION_OPTIONS.forEach((origin) => {
      REGION_OPTIONS.forEach((destination) => {
        const route = shippingRouteMap.get(`${origin.id}:${destination.id}`);
        if (!route) {
          missing += 1;
        } else if (route.notes?.toLowerCase().includes("seeded") || route.notes?.toLowerCase().includes("baseline")) {
          needsUpdate += 1;
        } else if (route.isActive) {
          active += 1;
        } else {
          missing += 1;
        }
      });
    });

    return { active, missing, needsUpdate };
  }, [shippingRouteMap]);

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
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-secondary">
                  <MapPinned className="h-4 w-4" />
                  Map Controls
                </p>
                <h2 className="mt-2 text-xl font-black">إعدادات الخريطة</h2>
                <p className="mt-1 text-sm text-slate-500">إدارة طريقة عرض الخريطة ومواقع المصانع وألوانها وحالة ظهورها.</p>
              </div>
              <button
                type="button"
                onClick={() => void saveMapSettings()}
                className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2 text-sm font-black text-slate-950 hover:bg-secondary/90"
              >
                <Save className="h-4 w-4" />
                حفظ إعدادات العرض
              </button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-slate-400">مقياس التلوين</span>
                <select
                  value={mapSettingsDraft.heatmapMetric}
                  onChange={(event) =>
                    setMapSettingsDraft((current) => ({
                      ...current,
                      heatmapMetric: event.target.value as MapDisplaySettings["heatmapMetric"],
                    }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none focus:border-secondary"
                >
                  {HEATMAP_METRIC_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold text-slate-400">المنطقة الافتراضية</span>
                <select
                  value={mapSettingsDraft.defaultRegionId}
                  onChange={(event) =>
                    setMapSettingsDraft((current) => ({
                      ...current,
                      defaultRegionId: event.target.value as MapDisplaySettings["defaultRegionId"],
                    }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none focus:border-secondary"
                >
                  {REGION_OPTIONS.map((region) => (
                    <option key={region.id} value={region.id}>{region.name}</option>
                  ))}
                </select>
              </label>

              <label className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                <span>
                  <span className="block text-sm font-black text-white">إظهار مقياس الكثافة</span>
                  <span className="text-xs text-slate-500">الشريط أسفل الخريطة</span>
                </span>
                <input
                  type="checkbox"
                  checked={mapSettingsDraft.showLegend}
                  onChange={(event) => setMapSettingsDraft((current) => ({ ...current, showLegend: event.target.checked }))}
                  className="h-5 w-5 accent-secondary"
                />
              </label>

              <label className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                <span>
                  <span className="block text-sm font-black text-white">إظهار قائمة المصانع</span>
                  <span className="text-xs text-slate-500">بطاقة تفاصيل المنطقة</span>
                </span>
                <input
                  type="checkbox"
                  checked={mapSettingsDraft.showFactoryList}
                  onChange={(event) =>
                    setMapSettingsDraft((current) => ({ ...current, showFactoryList: event.target.checked }))
                  }
                  className="h-5 w-5 accent-secondary"
                />
              </label>
            </div>
          </div>

          <div className="border-b border-white/8 p-6">
            <h3 className="text-sm font-black text-white">ملخص المناطق النشطة</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {regionalSummary.map((region) => (
                <div key={region.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-white">{region.name}</p>
                    <span className="rounded-full bg-secondary/15 px-2.5 py-1 text-xs font-black text-secondary">
                      {region.count} مصنع
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <span>الطاقة: <b className="text-white">{region.capacity}</b></span>
                    <span>الإنتاج: <b className="text-white">{region.production}</b></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-right text-sm">
              <thead className="bg-white/5 text-xs text-slate-400">
                <tr>
                  {["المصنع", "المنطقة على الخريطة", "اسم المنطقة", "اللون", "الظهور", "إجراء"].map((heading) => (
                    <th key={heading} className="px-4 py-3 font-black">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">جاري تحميل بيانات الخريطة...</td>
                  </tr>
                ) : (
                  factories.map((factory) => {
                    const isEditingMap = mapEditingId === factory.id && mapEditDraft;
                    return (
                      <tr key={factory.id} className="border-t border-white/5 hover:bg-white/3">
                        <td className="px-4 py-3">
                          <div className="font-black text-white">{factory.name}</div>
                          <div className="text-xs text-slate-500">{factory.id}</div>
                        </td>
                        <td className="px-4 py-3">
                          {isEditingMap ? (
                            <select
                              value={mapEditDraft.region_id}
                              onChange={(event) => {
                                const nextRegionId = event.target.value;
                                setMapEditDraft({
                                  ...mapEditDraft,
                                  region_id: nextRegionId,
                                  region: regionName(nextRegionId),
                                });
                              }}
                              className="w-40 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-secondary"
                            >
                              {REGION_OPTIONS.map((region) => (
                                <option key={region.id} value={region.id}>{region.name}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="font-bold text-white">{regionName(factory.regionId)}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditingMap ? (
                            <input
                              value={mapEditDraft.region}
                              onChange={(event) => setMapEditDraft({ ...mapEditDraft, region: event.target.value })}
                              className="w-44 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-secondary"
                            />
                          ) : (
                            <span>{factory.region}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditingMap ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={mapEditDraft.color}
                                onChange={(event) => setMapEditDraft({ ...mapEditDraft, color: event.target.value })}
                                className="h-9 w-10 rounded-lg border border-white/10 bg-slate-950"
                              />
                              <input
                                value={mapEditDraft.color}
                                onChange={(event) => setMapEditDraft({ ...mapEditDraft, color: event.target.value })}
                                className="w-28 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-secondary"
                              />
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-2">
                              <span className="h-3 w-3 rounded-full" style={{ background: factory.color }} />
                              <span className="font-mono text-xs text-slate-300">{factory.color}</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditingMap ? (
                            <label className="inline-flex items-center gap-2 text-sm font-bold text-white">
                              <input
                                type="checkbox"
                                checked={mapEditDraft.is_active}
                                onChange={(event) => setMapEditDraft({ ...mapEditDraft, is_active: event.target.checked })}
                                className="h-4 w-4 accent-secondary"
                              />
                              ظاهر
                            </label>
                          ) : (
                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${factory.isActive === false ? "bg-red-500/15 text-red-300" : "bg-emerald-500/15 text-emerald-300"}`}>
                              {factory.isActive === false ? "مخفي" : "ظاهر"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditingMap ? (
                            <button
                              type="button"
                              onClick={() => void saveMapFactory(factory.id)}
                              className="inline-flex items-center gap-1 rounded-xl bg-secondary px-3 py-2 text-xs font-black text-slate-950"
                            >
                              <Save className="h-3.5 w-3.5" />
                              حفظ
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => startMapEdit(factory)}
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

        <section className="mb-8 overflow-hidden rounded-3xl border border-white/8 bg-slate-900">
          <div className="border-b border-white/8 p-6">
            <div className="mb-5 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsCreatingFactory((current) => !current);
                  setNewFactory(newFactoryDraft());
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2 text-sm font-black text-slate-950 hover:bg-secondary/90"
              >
                <Plus className="h-4 w-4" />
                Add Factory
              </button>
            </div>
            <h2 className="text-xl font-black">المصانع والأسعار</h2>
            <p className="mt-1 text-sm text-slate-500">تعديل الأسعار يحدث سجل الأسعار ويعيد تحميل بيانات الموقع.</p>
            {isCreatingFactory && (
              <div className="mt-6 rounded-2xl border border-secondary/25 bg-secondary/5 p-4">
                {renderFactoryForm(newFactory, (patch) => setNewFactory((current) => ({ ...current, ...patch })), true)}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void createFactory()}
                    className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-black text-slate-950"
                  >
                    <Save className="h-4 w-4" />
                    Save Factory
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreatingFactory(false)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
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
                      <Fragment key={factory.id}>
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
                        <td className="px-4 py-3 font-black text-secondary">{Number(factory.bagPrice).toFixed(2)}</td>
                        <td className="px-4 py-3 font-bold text-white">{Number(factory.bulkPrice).toFixed(2)}</td>
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
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => void saveFactory(factory.id)}
                                disabled={savingFactoryId === factory.id}
                                className="inline-flex items-center gap-1 rounded-xl bg-secondary px-3 py-2 text-xs font-black text-slate-950"
                              >
                                <Save className="h-3.5 w-3.5" />
                                {savingFactoryId === factory.id ? "جار الحفظ..." : "حفظ"}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingId(null);
                                  setEditDraft(null);
                                }}
                                className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => startEdit(factory)}
                                className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white hover:bg-white/10"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                تعديل
                              </button>
                              {factory.isActive !== false && (
                                <button
                                  type="button"
                                  onClick={() => void deactivateFactory(factory)}
                                  className="inline-flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-500/15"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Deactivate
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                      {isEditing && (
                        <tr className="border-t border-secondary/15 bg-secondary/5">
                          <td colSpan={8} className="px-4 py-4">
                            {renderFactoryForm(editDraft, (patch) => setEditDraft((current) => (current ? { ...current, ...patch } : current)), false)}
                            <div className="mt-4 flex flex-wrap justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => void saveFactory(factory.id)}
                                disabled={savingFactoryId === factory.id}
                                className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <Save className="h-4 w-4" />
                                {savingFactoryId === factory.id ? "جار الحفظ..." : "حفظ بيانات المصنع"}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingId(null);
                                  setEditDraft(null);
                                }}
                                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8 overflow-hidden rounded-3xl border border-white/8 bg-slate-900">
          <div className="border-b border-white/8 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-secondary">
                  <Truck className="h-4 w-4" />
                  Shipping Matrix
                </p>
                <h2 className="mt-2 text-xl font-black">مصفوفة الشحن بين المناطق</h2>
                <p className="mt-1 text-sm text-slate-500">إدارة تكلفة الطن وحد الشحن الأدنى ومدة التسليم لكل مسار.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  value={matrixProductType}
                  onChange={(event) => {
                    setMatrixProductType(event.target.value);
                    setShippingEditingId(null);
                    setShippingEditDraft(null);
                  }}
                  className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm font-bold text-white outline-none focus:border-secondary"
                >
                  <option value="bulk">إسمنت سائب</option>
                  <option value="bag">إسمنت مكيس</option>
                </select>
                <select
                  value={matrixTruckType}
                  onChange={(event) => {
                    setMatrixTruckType(event.target.value);
                    setShippingEditingId(null);
                    setShippingEditDraft(null);
                  }}
                  className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm font-bold text-white outline-none focus:border-secondary"
                >
                  <option value="tanker">صهريج</option>
                  <option value="trailer">مقطورة</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-b border-white/8 p-6">
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-xs font-bold text-emerald-300">مسارات نشطة</p>
                <p className="mt-1 text-2xl font-black text-white">{shippingMatrixSummary.active}</p>
              </div>
              <div className="rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4">
                <p className="text-xs font-bold text-amber-200">تحتاج تحديث</p>
                <p className="mt-1 text-2xl font-black text-white">{shippingMatrixSummary.needsUpdate}</p>
              </div>
              <div className="rounded-2xl border border-slate-600 bg-slate-800/60 p-4">
                <p className="text-xs font-bold text-slate-300">مسارات مفقودة</p>
                <p className="mt-1 text-2xl font-black text-white">{shippingMatrixSummary.missing}</p>
              </div>
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-400">
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-emerald-500/50" /> نشط</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-amber-400/60" /> يحتاج تحديث</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-slate-700" /> لا يوجد مسار</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[1500px] border-collapse text-right text-xs">
                <thead className="bg-slate-950 text-slate-300">
                  <tr>
                    <th className="sticky right-0 z-20 w-36 border-l border-white/10 bg-slate-950 px-3 py-3 font-black">
                      من / إلى
                    </th>
                    {REGION_OPTIONS.map((destination) => (
                      <th key={destination.id} className="min-w-24 border-l border-white/10 px-2 py-3 text-center font-black">
                        {destination.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {REGION_OPTIONS.map((origin) => (
                    <tr key={origin.id} className="border-t border-white/8">
                      <th className="sticky right-0 z-10 border-l border-white/10 bg-slate-950 px-3 py-3 text-right font-black text-white">
                        {origin.name}
                      </th>
                      {REGION_OPTIONS.map((destination) => {
                        const cellKey = `${origin.id}:${destination.id}`;
                        const route = shippingRouteMap.get(cellKey);
                        const isEditingCell = shippingEditingId === cellKey && shippingEditDraft;
                        const needsUpdate =
                          !!route &&
                          (route.notes?.toLowerCase().includes("seeded") || route.notes?.toLowerCase().includes("baseline"));
                        const cellClass = !route
                          ? "border-slate-700 bg-slate-800/70 text-slate-400"
                          : needsUpdate
                            ? "border-amber-400/30 bg-amber-400/15 text-amber-100"
                            : route.isActive
                              ? "border-emerald-400/25 bg-emerald-500/12 text-emerald-100"
                              : "border-slate-600 bg-slate-700/60 text-slate-300";

                        return (
                          <td key={destination.id} className="border-l border-white/5 p-1.5 align-top">
                            {isEditingCell ? (
                              <div className="min-h-28 rounded-xl border border-secondary/50 bg-slate-950 p-2 shadow-lg shadow-black/20">
                                <input
                                  value={shippingEditDraft.cost_per_ton}
                                  onChange={(event) =>
                                    setShippingEditDraft({ ...shippingEditDraft, cost_per_ton: event.target.value })
                                  }
                                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-center text-sm font-black text-white outline-none focus:border-secondary"
                                  placeholder="التكلفة"
                                />
                                <div className="mt-2 grid grid-cols-2 gap-1">
                                  <input
                                    value={shippingEditDraft.delivery_days_min}
                                    onChange={(event) =>
                                      setShippingEditDraft({ ...shippingEditDraft, delivery_days_min: event.target.value })
                                    }
                                    className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-center text-white outline-none focus:border-secondary"
                                    title="أقل مدة تسليم"
                                  />
                                  <input
                                    value={shippingEditDraft.delivery_days_max}
                                    onChange={(event) =>
                                      setShippingEditDraft({ ...shippingEditDraft, delivery_days_max: event.target.value })
                                    }
                                    className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-center text-white outline-none focus:border-secondary"
                                    title="أعلى مدة تسليم"
                                  />
                                </div>
                                <label className="mt-2 flex items-center justify-center gap-2 text-[10px] font-bold text-white/70">
                                  <input
                                    type="checkbox"
                                    checked={shippingEditDraft.is_active}
                                    onChange={(event) =>
                                      setShippingEditDraft({ ...shippingEditDraft, is_active: event.target.checked })
                                    }
                                    className="h-3.5 w-3.5 accent-secondary"
                                  />
                                  نشط
                                </label>
                                <div className="mt-2 flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => void saveShippingRoute()}
                                    className="flex-1 rounded-lg bg-secondary px-2 py-1.5 text-[10px] font-black text-slate-950"
                                  >
                                    حفظ
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setShippingEditingId(null);
                                      setShippingEditDraft(null);
                                    }}
                                    className="rounded-lg border border-white/10 px-2 py-1.5 text-[10px] font-bold text-white/70"
                                  >
                                    إلغاء
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => startShippingCellEdit(origin.id, destination.id)}
                                className={`h-20 w-full rounded-xl border px-2 py-2 text-center transition hover:border-secondary hover:bg-secondary/10 ${cellClass}`}
                                title={`${origin.name} إلى ${destination.name}`}
                              >
                                <span className="block text-base font-black">
                                  {route ? Number(route.costPerTon).toFixed(2) : "—"}
                                </span>
                                <span className="mt-1 block text-[10px] font-bold opacity-75">
                                  {route ? `${route.deliveryDaysMin}-${route.deliveryDaysMax} يوم` : "لا يوجد"}
                                </span>
                                {needsUpdate && <span className="mt-1 block text-[9px] font-black text-amber-200">تحديث</span>}
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="hidden">
            <table className="w-full min-w-[1120px] text-right text-sm">
              <thead className="bg-white/5 text-xs text-slate-400">
                <tr>
                  {["من", "إلى", "المنتج", "الشاحنة", "تكلفة الطن", "الحد الأدنى", "أيام من", "أيام إلى", "الحالة", "إجراء"].map((heading) => (
                    <th key={heading} className="px-4 py-3 font-black">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shippingEditingId === "new" && shippingEditDraft && (
                  <tr className="border-t border-secondary/20 bg-secondary/5">
                    <td className="px-4 py-3">
                      <select
                        value={shippingEditDraft.origin_region_id}
                        onChange={(event) => setShippingEditDraft({ ...shippingEditDraft, origin_region_id: event.target.value })}
                        className="w-36 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-secondary"
                      >
                        {REGION_OPTIONS.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={shippingEditDraft.destination_region_id}
                        onChange={(event) => setShippingEditDraft({ ...shippingEditDraft, destination_region_id: event.target.value })}
                        className="w-36 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-secondary"
                      >
                        {REGION_OPTIONS.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={shippingEditDraft.product_type}
                        onChange={(event) => setShippingEditDraft({ ...shippingEditDraft, product_type: event.target.value })}
                        className="w-28 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-secondary"
                      >
                        <option value="bulk">bulk</option>
                        <option value="bag">bag</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={shippingEditDraft.truck_type}
                        onChange={(event) => setShippingEditDraft({ ...shippingEditDraft, truck_type: event.target.value })}
                        className="w-32 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-secondary"
                      >
                        <option value="tanker">tanker</option>
                        <option value="trailer">trailer</option>
                      </select>
                    </td>
                    {(["cost_per_ton", "minimum_charge", "delivery_days_min", "delivery_days_max"] as const).map((field) => (
                      <td key={field} className="px-4 py-3">
                        <input
                          value={shippingEditDraft[field]}
                          onChange={(event) => setShippingEditDraft({ ...shippingEditDraft, [field]: event.target.value })}
                          className="w-24 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-secondary"
                        />
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <label className="inline-flex items-center gap-2 text-sm font-bold text-white">
                        <input
                          type="checkbox"
                          checked={shippingEditDraft.is_active}
                          onChange={(event) => setShippingEditDraft({ ...shippingEditDraft, is_active: event.target.checked })}
                          className="h-4 w-4 accent-secondary"
                        />
                        نشط
                      </label>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => void saveShippingRoute()}
                        className="inline-flex items-center gap-1 rounded-xl bg-secondary px-3 py-2 text-xs font-black text-slate-950"
                      >
                        <Save className="h-3.5 w-3.5" />
                        حفظ
                      </button>
                    </td>
                  </tr>
                )}
                {shippingCosts.map((route) => {
                  const isEditingRoute = shippingEditingId === route.id && shippingEditDraft;
                  return (
                    <tr key={route.id} className="border-t border-white/5 hover:bg-white/3">
                      <td className="px-4 py-3">
                        {isEditingRoute ? (
                          <select
                            value={shippingEditDraft.origin_region_id}
                            onChange={(event) => setShippingEditDraft({ ...shippingEditDraft, origin_region_id: event.target.value })}
                            className="w-36 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-secondary"
                          >
                            {REGION_OPTIONS.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}
                          </select>
                        ) : regionName(route.originRegionId)}
                      </td>
                      <td className="px-4 py-3">
                        {isEditingRoute ? (
                          <select
                            value={shippingEditDraft.destination_region_id}
                            onChange={(event) => setShippingEditDraft({ ...shippingEditDraft, destination_region_id: event.target.value })}
                            className="w-36 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-secondary"
                          >
                            {REGION_OPTIONS.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}
                          </select>
                        ) : regionName(route.destinationRegionId)}
                      </td>
                      <td className="px-4 py-3">
                        {isEditingRoute ? (
                          <select
                            value={shippingEditDraft.product_type}
                            onChange={(event) => setShippingEditDraft({ ...shippingEditDraft, product_type: event.target.value })}
                            className="w-28 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-secondary"
                          >
                            <option value="bulk">bulk</option>
                            <option value="bag">bag</option>
                          </select>
                        ) : route.productType}
                      </td>
                      <td className="px-4 py-3">
                        {isEditingRoute ? (
                          <select
                            value={shippingEditDraft.truck_type}
                            onChange={(event) => setShippingEditDraft({ ...shippingEditDraft, truck_type: event.target.value })}
                            className="w-32 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-secondary"
                          >
                            <option value="tanker">tanker</option>
                            <option value="trailer">trailer</option>
                          </select>
                        ) : route.truckType}
                      </td>
                      {isEditingRoute ? (
                        <>
                          {(["cost_per_ton", "minimum_charge", "delivery_days_min", "delivery_days_max"] as const).map((field) => (
                            <td key={field} className="px-4 py-3">
                              <input
                                value={shippingEditDraft[field]}
                                onChange={(event) => setShippingEditDraft({ ...shippingEditDraft, [field]: event.target.value })}
                                className="w-24 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-secondary"
                              />
                            </td>
                          ))}
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 font-black text-secondary">{Number(route.costPerTon).toFixed(2)}</td>
                          <td className="px-4 py-3">{Number(route.minimumCharge).toFixed(2)}</td>
                          <td className="px-4 py-3">{route.deliveryDaysMin}</td>
                          <td className="px-4 py-3">{route.deliveryDaysMax}</td>
                        </>
                      )}
                      <td className="px-4 py-3">
                        {isEditingRoute ? (
                          <label className="inline-flex items-center gap-2 text-sm font-bold text-white">
                            <input
                              type="checkbox"
                              checked={shippingEditDraft.is_active}
                              onChange={(event) => setShippingEditDraft({ ...shippingEditDraft, is_active: event.target.checked })}
                              className="h-4 w-4 accent-secondary"
                            />
                            نشط
                          </label>
                        ) : (
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${route.isActive ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>
                            {route.isActive ? "نشط" : "متوقف"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditingRoute ? (
                          <button
                            type="button"
                            onClick={() => void saveShippingRoute()}
                            className="inline-flex items-center gap-1 rounded-xl bg-secondary px-3 py-2 text-xs font-black text-slate-950"
                          >
                            <Save className="h-3.5 w-3.5" />
                            حفظ
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startShippingEdit(route)}
                            className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white hover:bg-white/10"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            تعديل
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8 overflow-hidden rounded-3xl border border-white/8 bg-slate-900">
          <div className="border-b border-white/8 p-6">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-secondary">
              <History className="h-4 w-4" />
              Change Log
            </p>
            <h2 className="mt-2 text-xl font-black">Admin Audit Trail</h2>
            <p className="mt-1 text-sm text-slate-500">Latest persisted admin changes with timestamp, field, old value, new value, and factory name when available.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-right text-sm">
              <thead className="bg-white/5 text-xs text-slate-400">
                <tr>
                  {["Timestamp", "Factory", "Action", "Field", "Old value", "New value"].map((heading) => (
                    <th key={heading} className="px-4 py-3 font-black">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {changeLog.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No admin changes recorded yet.</td>
                  </tr>
                ) : (
                  changeLog.map((entry) => (
                    <tr key={entry.id} className="border-t border-white/5 hover:bg-white/3">
                      <td className="px-4 py-3 text-slate-300">{new Date(entry.timestamp).toLocaleString("ar-SA")}</td>
                      <td className="px-4 py-3 font-bold text-white">{entry.factoryName ?? entry.entityId}</td>
                      <td className="px-4 py-3">{entry.action}</td>
                      <td className="px-4 py-3 font-mono text-xs text-secondary">{entry.field}</td>
                      <td className="max-w-52 truncate px-4 py-3 text-slate-400" title={entry.oldValue}>{entry.oldValue}</td>
                      <td className="max-w-52 truncate px-4 py-3 text-slate-200" title={entry.newValue}>{entry.newValue}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-white/8 bg-slate-900 p-6">
          <h2 className="text-xl font-black">إعدادات الموقع</h2>
          <p className="mt-1 text-sm text-slate-500">إعدادات عامة قابلة للتوسع لاحقا لرسائل الحالة ومصدر البيانات.</p>
          <div className="mt-5 space-y-4">
            {generalSettings.length === 0 ? (
              <div className="rounded-2xl border border-white/8 bg-white/3 p-5 text-sm text-slate-500">لا توجد إعدادات محفوظة حاليا.</div>
            ) : (
              generalSettings.map((setting) => (
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
