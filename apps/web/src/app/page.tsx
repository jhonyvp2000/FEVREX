import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QuoteWidget } from "@/components/quote/QuoteWidget";
import { ShieldCheck, Clock, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[128px]" />
        </div>

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
              El mejor tipo de cambio <br />
              <span className="text-amber-500">seguro y al instante.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0">
              Cambia dólares y soles desde la comodidad de tu casa u oficina. Sin comisiones ocultas y con la mejor tasa del mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck className="text-emerald-500" /> Regulado SBS
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="text-amber-600" /> Atención 24/7 (Registro)
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <QuoteWidget />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegir Fevrex?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<TrendingUp className="w-10 h-10 text-amber-500" />}
              title="Mejor Tasa"
              desc="Monitoreamos el mercado en tiempo real para ofrecerte siempre el mejor spread."
            />
            <FeatureCard
              icon={<Clock className="w-10 h-10 text-amber-500" />}
              title="Rapidez"
              desc="Operaciones procesadas en 15 minutos en horario hábil. Sin esperas innecesarias."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-10 h-10 text-amber-500" />}
              title="Seguridad Total"
              desc="Tus datos y dinero están protegidos con estándares bancarios y regulación SBS."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-500/50 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-slate-100">{title}</h3>
      <p className="text-slate-400">{desc}</p>
    </div>
  );
}
