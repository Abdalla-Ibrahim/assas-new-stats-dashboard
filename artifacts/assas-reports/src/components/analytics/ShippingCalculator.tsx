import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, Package, Calculator, Clock, Banknote } from "lucide-react";
import { useCementFactories } from "@/contexts/FactoriesContext";
import { REGION_OPTIONS } from "@/data/mapSettings";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

const PRODUCT_TYPES = [
  { id: "bulk", name: "إسمنت سائب", truckType: "tanker" },
  { id: "bag", name: "إسمنت مكيس", truckType: "trailer" },
];

const TRUCK_TYPES = [
  { id: "tanker", name: "صهريج إسمنت سائب" },
  { id: "trailer", name: "مقطورة أكياس" },
];

type ShippingResult = {
  materialCost: number;
  shippingCost: number;
  totalLandedCost: number;
  landedCostPerTon: number;
  landedCostPerBag: number;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  currency: string;
  route: {
    costPerTon: number;
    minimumCharge: number;
    notes?: string | null;
  };
};

const formatSAR = (value: number) =>
  new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);

export function ShippingCalculator() {
  const { factories } = useCementFactories();
  const activeFactories = factories.filter((factory) => factory.bagPrice > 0 || factory.bulkPrice > 0);
  const [factoryId, setFactoryId] = useState(activeFactories[0]?.id ?? "");
  const [destinationRegionId, setDestinationRegionId] = useState("makkah");
  const [productType, setProductType] = useState("bulk");
  const [truckType, setTruckType] = useState("tanker");
  const [tons, setTons] = useState(40);
  const [result, setResult] = useState<ShippingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!factoryId && activeFactories[0]?.id) {
      setFactoryId(activeFactories[0].id);
    }
  }, [activeFactories, factoryId]);

  const selectedFactory = useMemo(
    () => factories.find((factory) => factory.id === factoryId),
    [factories, factoryId],
  );

  useEffect(() => {
    const product = PRODUCT_TYPES.find((item) => item.id === productType);
    if (product) setTruckType(product.truckType);
  }, [productType]);

  useEffect(() => {
    if (!factoryId || !destinationRegionId || !productType || !truckType || tons <= 0) return;

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/api/shipping/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ factoryId, destinationRegionId, productType, truckType, tons }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? "تعذر حساب تكلفة الشحن");
        }
        return response.json() as Promise<ShippingResult>;
      })
      .then((payload) => {
        setResult(payload);
        setError(null);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setResult(null);
        setError(err instanceof Error ? err.message : "تعذر حساب تكلفة الشحن");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [destinationRegionId, factoryId, productType, tons, truckType]);

  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-2xl">
      <div className="bg-gradient-to-l from-primary via-primary to-primary/80 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/20 text-secondary">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-secondary">حاسبة تكلفة الوصول</p>
            <h3 className="text-2xl font-black">سعر المصنع مضافا إليه شحن المنطقة</h3>
          </div>
        </div>
      </div>
      <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-2 flex items-center gap-1.5 text-sm font-bold">
                <MapPin className="h-3.5 w-3.5 text-primary" /> المصنع
              </Label>
              <Select value={factoryId} onValueChange={setFactoryId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {activeFactories.map((factory) => (
                    <SelectItem key={factory.id} value={factory.id}>{factory.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 flex items-center gap-1.5 text-sm font-bold">
                <MapPin className="h-3.5 w-3.5 text-secondary" /> منطقة التسليم
              </Label>
              <Select value={destinationRegionId} onValueChange={setDestinationRegionId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REGION_OPTIONS.map((region) => (
                    <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-2 flex items-center gap-1.5 text-sm font-bold">
                <Package className="h-3.5 w-3.5 text-primary" /> نوع المنتج
              </Label>
              <Select value={productType} onValueChange={setProductType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRODUCT_TYPES.map((item) => (
                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 flex items-center gap-1.5 text-sm font-bold">
                <Truck className="h-3.5 w-3.5 text-primary" /> نوع الشاحنة
              </Label>
              <Select value={truckType} onValueChange={setTruckType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TRUCK_TYPES.map((item) => (
                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="mb-2 flex items-center gap-1.5 text-sm font-bold">
              <Package className="h-3.5 w-3.5 text-primary" /> الكمية بالطن:{" "}
              <span className="font-black text-secondary">{tons}</span>
            </Label>
            <Input
              type="range"
              min={5}
              max={400}
              step={5}
              value={tons}
              onChange={(event) => setTons(Number(event.target.value))}
              className="cursor-pointer accent-secondary"
            />
            <div className="mt-1 flex justify-between text-[11px] text-slate-500">
              <span>5 طن</span><span>200 طن</span><span>400 طن</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-primary p-6 text-white shadow-inner">
          <p className="text-xs font-bold text-secondary">التكلفة الإجمالية للوجهة</p>
          <div className="mt-3 flex items-end gap-2">
            <p className="text-5xl font-black leading-none text-white">
              {formatSAR(result?.totalLandedCost ?? 0)}
            </p>
            <p className="mb-1.5 text-lg font-bold text-secondary">ريال</p>
          </div>
          <p className="mt-1 text-xs text-white/60">
            {selectedFactory ? `${selectedFactory.name} إلى ${REGION_OPTIONS.find((region) => region.id === destinationRegionId)?.name ?? destinationRegionId}` : "اختر مصنعاً لحساب التكلفة"}
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs text-red-200">
              {error}
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-[10px] font-bold text-white/60">قيمة المادة</p>
              <p className="text-xl font-black text-white">{formatSAR(result?.materialCost ?? 0)} ريال</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-[10px] font-bold text-white/60">تكلفة الشحن</p>
              <p className="text-xl font-black text-white">{formatSAR(result?.shippingCost ?? 0)} ريال</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-[10px] font-bold text-white/60">التكلفة لكل طن</p>
              <p className="text-xl font-black text-secondary">{formatSAR(result?.landedCostPerTon ?? 0)} ريال</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-[10px] font-bold text-white/60">مدة التسليم</p>
              <p className="text-xl font-black text-white">
                {result ? `${result.deliveryDaysMin}-${result.deliveryDaysMax} يوم` : isLoading ? "..." : "-"}
              </p>
            </div>
          </div>

          {productType === "bag" && result && (
            <div className="mt-4 rounded-xl bg-white/10 p-3">
              <p className="text-[10px] font-bold text-white/60">تكلفة الكيس بعد الشحن</p>
              <p className="text-2xl font-black text-secondary">{result.landedCostPerBag.toFixed(2)} ريال</p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-secondary/30 bg-secondary/10 p-3">
            <Banknote className="h-5 w-5 text-secondary" />
            <p className="text-xs leading-relaxed text-white/85">
              السعر يستخدم مصفوفة الشحن الإدارية النشطة. حد الشحن الأدنى للمسار: {formatSAR(result?.route.minimumCharge ?? 0)} ريال.
            </p>
          </div>

          <Button className="mt-5 w-full bg-secondary font-black text-secondary-foreground shadow-lg hover:bg-secondary/90">
            <Clock className="ml-2 h-4 w-4" />
            تثبيت العرض وطلب التواصل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

