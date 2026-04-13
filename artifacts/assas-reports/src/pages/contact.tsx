import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, Clock, Mail, MapPin, Send, Truck } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  phone: z.string().min(10, { message: "رقم الجوال يجب أن يكون 10 أرقام على الأقل" }),
  subject: z.string().min(5, { message: "الموضوع مطلوب" }),
  message: z.string().min(10, { message: "الرسالة يجب أن تكون 10 أحرف على الأقل" }),
});

const locations = [
  { city: "الرياض", role: "المقر الرئيسي", address: "شارع الصناعة، الرياض — صندوق بريد: 12345" },
  { city: "الدمام", role: "فرع التوزيع", address: "المنطقة الصناعية، الدمام" },
  { city: "حفر الباطن", role: "نقطة تشغيل وتغطية", address: "حفر الباطن — صندوق بريد: 12345" },
];

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit() {
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "تم تجهيز الطلب",
        description: "تم تسجيل بياناتك في نموذج المعاينة، ويمكن ربطه لاحقاً ببريد أو نظام مبيعات رسمي.",
      });
      form.reset();
    }, 800);
  }

  return (
    <div className="min-h-[calc(100vh-4rem-300px)] w-full bg-slate-50 py-12" data-testid="page-contact">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 rounded-3xl bg-slate-950 p-8 text-white md:p-12">
          <Badge className="mb-4 bg-secondary text-white hover:bg-secondary">هوية ومقرات أساس</Badge>
          <h1 className="mb-4 text-3xl font-black md:text-5xl">تواصل مع أساس الإعمار</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-300">
            لخدمات الإسمنت، النقل اللوجستي، وقطع الغيار داخل المملكة. هذه الصفحة تجمع مواقع التشغيل ونموذج طلب مناسب لعروض الأسعار والشراكات.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {locations.map((location) => (
            <Card key={location.city} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6">
                <MapPin className="mb-4 h-7 w-7 text-primary" />
                <h3 className="text-xl font-black text-slate-950">{location.city}</h3>
                <p className="mt-1 font-bold text-secondary">{location.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{location.address}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <Card className="border-none bg-primary text-primary-foreground shadow-sm">
              <CardContent className="p-8">
                <h3 className="mb-6 text-xl font-black">معلومات تشغيلية</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-full bg-primary-foreground/10 p-3">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="mb-1 text-lg font-bold">مجالات الخدمة</h4>
                      <p className="text-sm leading-relaxed text-primary-foreground/80">توريد الإسمنت، النقل اللوجستي، وقطع الغيار.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-full bg-primary-foreground/10 p-3">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="mb-1 text-lg font-bold">نطاق التغطية</h4>
                      <p className="text-sm leading-relaxed text-primary-foreground/80">جميع مناطق ومدن المملكة دون استثناء، مع خدمة للقرى والهجر حسب الإمكانية التشغيلية.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-full bg-primary-foreground/10 p-3">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="mb-1 text-lg font-bold">زمن التوصيل</h4>
                      <p className="text-sm leading-relaxed text-primary-foreground/80">24-72 ساعة حسب الكمية والموقع الدقيق.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-full bg-primary-foreground/10 p-3">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="mb-1 text-lg font-bold">طلبات التواصل</h4>
                      <p className="text-sm leading-relaxed text-primary-foreground/80">يمكن ربط النموذج لاحقاً بالبريد الرسمي أو نظام إدارة العملاء الخاص بالشركة.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-black">طلب عرض سعر أو استفسار</CardTitle>
                <CardDescription>املأ النموذج بطلبك وسيظهر بنفس هوية أساس الإعمار.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم الكامل</FormLabel>
                            <FormControl><Input placeholder="أدخل اسمك الكريم" {...field} className="bg-slate-50" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم الجوال</FormLabel>
                            <FormControl><Input placeholder="05xxxxxxxx" {...field} className="bg-slate-50 text-right font-mono" dir="ltr" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl><Input placeholder="example@domain.com" {...field} className="bg-slate-50 text-right font-mono" dir="ltr" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الموضوع</FormLabel>
                            <FormControl><Input placeholder="مثال: طلب توريد إسمنت للرياض" {...field} className="bg-slate-50" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تفاصيل الطلب</FormLabel>
                          <FormControl>
                            <Textarea placeholder="اكتب الكمية، المدينة، نوع الخدمة، والموعد المطلوب..." className="min-h-[150px] resize-y bg-slate-50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                      {isSubmitting ? "جاري التجهيز..." : <><Send className="ml-2 h-4 w-4" /> إرسال الطلب</>}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
