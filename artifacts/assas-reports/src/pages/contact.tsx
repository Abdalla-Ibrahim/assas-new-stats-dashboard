import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Clock, Mail, MapPin, Phone, Send, Truck, CheckCircle2, ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import officeImage from "@assets/Gemini_Generated_Image_rid8qnrid8qnrid8_1776938760079.png";
import truckFront from "@assets/Gemini_Generated_Image_yw5889yw5889yw58_1776938787664.png";

const formSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  phone: z.string().min(10, { message: "رقم الجوال يجب أن يكون 10 أرقام على الأقل" }),
  subject: z.string().min(5, { message: "الموضوع مطلوب" }),
  message: z.string().min(10, { message: "الرسالة يجب أن تكون 10 أحرف على الأقل" }),
});

const locations = [
  { city: "الرياض", role: "المقر الرئيسي", address: "شارع الصناعة، الرياض", icon: "🏢", accent: "#f5b800" },
  { city: "الدمام", role: "فرع التوزيع", address: "المنطقة الصناعية، الدمام", icon: "🏭", accent: "#3b82f6" },
  { city: "حفر الباطن", role: "نقطة تشغيل", address: "حفر الباطن — المنطقة الشرقية", icon: "📍", accent: "#10b981" },
];

const infoItems = [
  { icon: Building2, title: "مجالات الخدمة", desc: "توريد الإسمنت، النقل اللوجستي، وقطع الغيار." },
  { icon: Truck, title: "نطاق التغطية", desc: "جميع مناطق ومدن المملكة دون استثناء، مع خدمة للقرى والهجر." },
  { icon: Clock, title: "زمن التوصيل", desc: "24-72 ساعة حسب الكمية والموقع الدقيق." },
  { icon: Phone, title: "أوقات العمل", desc: "السبت – الخميس، من 7:00 ص حتى 9:00 م بتوقيت الرياض." },
];

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  function onSubmit() {
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast({ title: "تم إرسال طلبك بنجاح", description: "سيتواصل معك فريق أساس الإعمار خلال 24 ساعة." });
      form.reset();
      setTimeout(() => setSubmitted(false), 5000);
    }, 1200);
  }

  return (
    <div className="w-full" data-testid="page-contact">

      {/* HERO */}
      <section className="relative flex min-h-[50vh] items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${officeImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/90 to-slate-950/60" />
        <div className="absolute inset-0 pattern-dots opacity-15" />
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-secondary/40 to-transparent" />

        <div className="container relative z-10 mx-auto px-4 py-32">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="section-label mb-4">هوية ومقرات أساس</div>
              <h1 className="mb-4 text-5xl font-black text-white md:text-6xl">
                تواصل مع
                <br />
                <span className="text-gradient-gold">أساس الإعمار</span>
              </h1>
              <p className="text-lg leading-relaxed text-slate-400">
                لخدمات الإسمنت، النقل اللوجستي، وقطع الغيار داخل المملكة. فريقنا جاهز للرد خلال 24 ساعة.
              </p>
            </div>
            <div className="premium-card shrink-0 rounded-3xl p-1">
              <div className="flex h-36 w-36 items-center justify-center rounded-[22px] bg-slate-900/90 p-3">
                <BrandLogo size={100} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <div className="section-label mx-auto mb-3">المقرات التشغيلية</div>
            <h2 className="text-3xl font-black text-white">حضور ميداني في قلب المملكة</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {locations.map((loc) => (
              <div
                key={loc.city}
                className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/4 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-white/20"
              >
                <div className="mb-4 text-4xl">{loc.icon}</div>
                <h3 className="mb-1 text-2xl font-black text-white">{loc.city}</h3>
                <div className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold" style={{ background: `${loc.accent}20`, color: loc.accent }}>
                  {loc.role}
                </div>
                <p className="text-sm text-slate-400">{loc.address}</p>
                <div className="mt-6 h-px w-0 rounded-full transition-all duration-500 group-hover:w-full" style={{ background: `linear-gradient(90deg, ${loc.accent}, transparent)` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="bg-slate-950 py-20">
        <div className="absolute inset-0 pattern-grid opacity-20 pointer-events-none" />
        <div className="container relative mx-auto max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">

            {/* INFO PANEL */}
            <div className="space-y-6">
              <div>
                <div className="section-label mb-3">معلومات تشغيلية</div>
                <h2 className="text-3xl font-black text-white">كيف نخدمك؟</h2>
              </div>

              {infoItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 rounded-2xl border border-white/8 bg-white/4 p-5 transition-all hover:border-secondary/30">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/15">
                      <Icon className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-black text-white">{item.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                );
              })}

              {/* Assurance */}
              <div className="rounded-2xl border border-secondary/25 bg-gradient-to-br from-secondary/10 to-secondary/3 p-6">
                <div className="mb-4 flex items-center gap-2 text-secondary">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-black">ضمان الاستجابة</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-400">
                  نلتزم بالرد على جميع الاستفسارات خلال 24 ساعة من وقت الإرسال أيام العمل.
                </p>
              </div>
            </div>

            {/* FORM */}
            <div className="rounded-3xl border border-white/8 bg-white/3 p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-white">طلب عرض سعر أو استفسار</h2>
                <p className="mt-2 text-slate-400">املأ النموذج وسيتواصل معك فريقنا بأسرع وقت.</p>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
                    <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white">تم إرسال طلبك بنجاح!</h3>
                  <p className="text-slate-400">سيتواصل معك فريق أساس الإعمار خلال 24 ساعة.</p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300 font-bold">الاسم الكامل</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسمك الكريم" {...field} className="border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-secondary/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300 font-bold">رقم الجوال</FormLabel>
                          <FormControl>
                            <Input placeholder="05xxxxxxxx" {...field} className="border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-secondary/50 font-mono" dir="ltr" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300 font-bold">البريد الإلكتروني</FormLabel>
                          <FormControl>
                            <Input placeholder="example@domain.com" {...field} className="border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-secondary/50 font-mono" dir="ltr" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="subject" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300 font-bold">الموضوع</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: طلب توريد إسمنت للرياض" {...field} className="border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-secondary/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 font-bold">تفاصيل الطلب</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="اكتب الكمية، المدينة، نوع الخدمة، والموعد المطلوب..."
                            className="min-h-[140px] resize-y border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-secondary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-secondary py-4 text-base font-black text-slate-950 shadow-xl shadow-secondary/20 transition-all hover:shadow-secondary/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          إرسال الطلب
                          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        </>
                      )}
                      <div className="absolute inset-0 bg-white/15 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAP IMAGE STRIP */}
      <section className="relative h-40 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${truckFront})` }} />
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" />
        <div className="relative flex h-full items-center justify-center">
          <p className="text-center text-xl font-black text-white">
            تغطية <span className="text-secondary">100%</span> لجميع مناطق المملكة العربية السعودية
          </p>
        </div>
      </section>
    </div>
  );
}
