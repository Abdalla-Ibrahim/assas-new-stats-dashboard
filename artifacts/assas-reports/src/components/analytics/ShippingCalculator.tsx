import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, Package, Calculator, Clock, Banknote } from "lucide-react";

const ORIGINS = [
  { id: "riyadh", name: "الرياض (المقر الرئيسي)" },
  { id: "dammam", name: "الدمام (فرع التوزيع)" },
];

const DESTINATIONS: Record<string, { name: string; baseDistance: Record<string, number> }> = {
  jeddah: { name: "جدة", baseDistance: { riyadh: 950, dammam: 1340 } },
  makkah: { name: "مكة المكرمة", baseDistance: { riyadh: 870, dammam: 1260 } },
  madinah: { name: "المدينة المنورة", baseDistance: { riyadh: 850, dammam: 1240 } },
  taif: { name: "الطائف", baseDistance: { riyadh: 780, dammam: 1170 } },
  abha: { name: "أبها", baseDistance: { riyadh: 1080, dammam: 1490 } },
  tabuk: { name: "تبوك", baseDistance: { riyadh: 1280, dammam: 1670 } },
  qassim: { name: "القصيم (بريدة)", baseDistance: { riyadh: 330, dammam: 720 } },
  hail: { name: "حائل", baseDistance: { riyadh: 640, dammam: 1030 } },
  jazan: { name: "جازان", baseDistance: { riyadh: 1280, dammam: 1690 } },
  najran: { name: "نجران", baseDistance: { riyadh: 1130, dammam: 1380 } },
  riyadhCity: { name: "داخل الرياض", baseDistance: { riyadh: 30, dammam: 410 } },
  dammamCity: { name: "داخل الدمام", baseDistance: { riyadh: 410, dammam: 30 } },
};

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  jeddah: { lat: 21.4858, lng: 39.1925 },
  makkah: { lat: 21.3891, lng: 39.8579 },
  madinah: { lat: 24.5247, lng: 39.5692 },
  taif: { lat: 21.4373, lng: 40.5127 },
  abha: { lat: 18.2164, lng: 42.5053 },
  tabuk: { lat: 28.3838, lng: 36.555 },
  qassim: { lat: 26.3592, lng: 43.9818 },
  hail: { lat: 27.5114, lng: 41.7208 },
  jazan: { lat: 16.8892, lng: 42.5611 },
  najran: { lat: 17.5656, lng: 44.2289 },
  riyadhCity: { lat: 24.7136, lng: 46.6753 },
  dammamCity: { lat: 26.4207, lng: 50.0888 },
};

const TRUCK_TYPES = [
  { id: "tanker", name: "صهريج إسمنت سائب (40 طن)", capacity: 40, ratePerKm: 4.2, fixed: 250 },
  { id: "trailer", name: "مقطورة كيس إسمنت (35 طن)", capacity: 35, ratePerKm: 3.8, fixed: 200 },
  { id: "small", name: "شاحنة صغيرة (10 طن)", capacity: 10, ratePerKm: 2.4, fixed: 120 },
];

const URGENCY = [
  { id: "standard", name: "قياسي (48-72 ساعة)", multiplier: 1.0 },
  { id: "express", name: "سريع (24-48 ساعة)", multiplier: 1.25 },
  { id: "urgent", name: "عاجل (خلال 24 ساعة)", multiplier: 1.55 },
];

const formatSAR = (n: number) => new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 0 }).format(n);

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const calculateRoadDistance = (originId: string, destinationId: string) => {
  if (originId === destinationId) {
    return 30;
  }

  const originCity = CITY_COORDINATES[originId];
  const destinationCity = CITY_COORDINATES[destinationId];
  const earthRadiusKm = 6371;
  const latDistance = toRadians(destinationCity.lat - originCity.lat);
  const lngDistance = toRadians(destinationCity.lng - originCity.lng);
  const originLat = toRadians(originCity.lat);
  const destinationLat = toRadians(destinationCity.lat);
  const haversine =
    Math.sin(latDistance / 2) ** 2 +
    Math.cos(originLat) * Math.cos(destinationLat) * Math.sin(lngDistance / 2) ** 2;
  const directDistance = 2 * earthRadiusKm * Math.asin(Math.sqrt(haversine));

  return Math.round(directDistance * 1.25);
};

export function ShippingCalculator() {
  const [origin, setOrigin] = useState("riyadhCity");
  const [destination, setDestination] = useState("jeddah");
  const [tons, setTons] = useState(40);
  const [truck, setTruck] = useState("tanker");
  const [urgency, setUrgency] = useState("standard");

  const result = useMemo(() => {
    const dist = calculateRoadDistance(origin, destination);
    const t = TRUCK_TYPES.find((x) => x.id === truck)!;
    const u = URGENCY.find((x) => x.id === urgency)!;
    const tripsNeeded = Math.max(1, Math.ceil(tons / t.capacity));
    const baseCost = (dist * t.ratePerKm + t.fixed) * tripsNeeded;
    const total = Math.round(baseCost * u.multiplier);
    const perTon = Math.round(total / tons);
    const days = u.id === "urgent" ? 1 : u.id === "express" ? 2 : 3;
    const co2 = Math.round(dist * tripsNeeded * 0.92);
    return { dist, tripsNeeded, total, perTon, days, co2 };
  }, [origin, destination, tons, truck, urgency]);

  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-2xl">
      <div className="bg-gradient-to-l from-primary via-primary to-primary/80 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/20 text-secondary">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-secondary">حاسبة شحن الإسمنت</p>
            <h3 className="text-2xl font-black">احسب تكلفة الشحن من نقطة لأخرى داخل المملكة</h3>
          </div>
        </div>
      </div>
      <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-2 flex items-center gap-1.5 text-sm font-bold">
                <MapPin className="h-3.5 w-3.5 text-primary" /> نقطة الانطلاق
              </Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(DESTINATIONS).map(([k, v]) => <SelectItem key={k} value={k}>{v.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 flex items-center gap-1.5 text-sm font-bold">
                <MapPin className="h-3.5 w-3.5 text-secondary" /> الوجهة
              </Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(DESTINATIONS).map(([k, v]) => <SelectItem key={k} value={k}>{v.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="mb-2 flex items-center gap-1.5 text-sm font-bold">
              <Package className="h-3.5 w-3.5 text-primary" /> الكمية بالطن: <span className="font-black text-secondary">{tons}</span>
            </Label>
            <Input
              type="range"
              min={5}
              max={400}
              step={5}
              value={tons}
              onChange={(e) => setTons(Number(e.target.value))}
              className="cursor-pointer accent-secondary"
            />
            <div className="mt-1 flex justify-between text-[11px] text-slate-500">
              <span>5 طن</span><span>200 طن</span><span>400 طن</span>
            </div>
          </div>

          <div>
            <Label className="mb-2 flex items-center gap-1.5 text-sm font-bold">
              <Truck className="h-3.5 w-3.5 text-primary" /> نوع الشاحنة
            </Label>
            <Select value={truck} onValueChange={setTruck}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TRUCK_TYPES.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 flex items-center gap-1.5 text-sm font-bold">
              <Clock className="h-3.5 w-3.5 text-primary" /> سرعة التوصيل
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {URGENCY.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setUrgency(u.id)}
                  className={`rounded-xl border p-3 text-right text-xs font-bold transition-all ${
                    urgency === u.id
                      ? "border-secondary bg-secondary/10 text-primary shadow-md"
                      : "border-slate-200 bg-white text-slate-600 hover:border-secondary/40"
                  }`}
                >
                  {u.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-primary p-6 text-white shadow-inner">
          <p className="text-xs font-bold text-secondary">عرض السعر التقديري</p>
          <div className="mt-3 flex items-end gap-2">
            <p className="text-5xl font-black leading-none text-white">{formatSAR(result.total)}</p>
            <p className="mb-1.5 text-lg font-bold text-secondary">ريال</p>
          </div>
          <p className="mt-1 text-xs text-white/60">شامل الوقود والسائق والرسوم التشغيلية الأساسية</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-[10px] font-bold text-white/60">المسافة</p>
              <p className="text-xl font-black text-white">{formatSAR(result.dist)} كم</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-[10px] font-bold text-white/60">عدد الرحلات</p>
              <p className="text-xl font-black text-white">{result.tripsNeeded}</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-[10px] font-bold text-white/60">تكلفة الطن</p>
              <p className="text-xl font-black text-secondary">{formatSAR(result.perTon)} ريال</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-[10px] font-bold text-white/60">مدة التوصيل</p>
              <p className="text-xl font-black text-white">{result.days} يوم</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-secondary/30 bg-secondary/10 p-3">
            <Banknote className="h-5 w-5 text-secondary" />
            <p className="text-xs leading-relaxed text-white/85">
              تقدير ~{formatSAR(result.co2)} كجم CO₂ — يمكن تخفيضها بدمج الرحلات أو اختيار الشاحنة الأكبر.
            </p>
          </div>

          <Button className="mt-5 w-full bg-secondary font-black text-secondary-foreground shadow-lg hover:bg-secondary/90">
            تثبيت العرض وطلب التواصل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
