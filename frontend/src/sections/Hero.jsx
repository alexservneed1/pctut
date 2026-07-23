import React from "react";
import { motion } from "framer-motion";
import { Cpu, Package, Wrench, ShieldCheck } from "lucide-react";
import { IMAGES } from "../config/site";
import { scrollToId } from "../lib/scroll";
import PCBTrace from "../components/PCBTrace";

const miniBenefits = [
  { icon: Cpu, label: "Сборка под задачи" },
  { icon: Package, label: "Комплектующие в наличии" },
  { icon: Wrench, label: "Сервис и апгрейд" },
  { icon: ShieldCheck, label: "Гарантия на работы" },
];

export default function Hero() {
  return (
    <section
      id="glavnaya"
      data-testid="section-hero"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      {/* Ambient glow + PCB decor */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(10,132,255,0.28), rgba(10,132,255,0) 70%)",
        }}
      />
      <PCBTrace className="absolute inset-x-0 top-24 w-full pointer-events-none" opacity={0.15} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0A84FF]/40 bg-[#0A84FF]/10 px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF] shadow-[0_0_8px_#00A3FF]" />
              <span className="text-xs font-semibold tracking-wide text-[#B7C0CC]">
                Энгельс · площадь Ленина, 20
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
              Соберём ПК <br className="hidden sm:block" />
              <span className="text-[#0A84FF] drop-shadow-[0_0_18px_rgba(10,132,255,0.5)]">
                под твои задачи
              </span>
            </h1>

            <p className="mt-5 text-lg sm:text-xl font-semibold text-white/90">
              Компьютеры, комплектующие и сервис в Энгельсе
            </p>
            <p className="mt-3 text-base text-[#B7C0CC] max-w-2xl leading-relaxed">
              Подберём, соберём, настроим и протестируем компьютер для игр, работы,
              учёбы, монтажа или бизнеса.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => scrollToId("zayavka")}
                data-testid="hero-calc-button"
                className="inline-flex items-center justify-center rounded-lg bg-[#0A84FF] text-white font-bold px-6 py-3.5 shadow-[0_0_15px_rgba(10,132,255,0.45)] hover:shadow-[0_0_28px_rgba(0,163,255,0.65)] hover:bg-[#00A3FF] active:scale-[0.98] transition-all"
              >
                Рассчитать сборку
              </button>
              <button
                type="button"
                onClick={() => scrollToId("uslugi")}
                data-testid="hero-services-button"
                className="inline-flex items-center justify-center rounded-lg bg-transparent border border-[#0A84FF]/55 text-white font-bold px-6 py-3.5 hover:bg-[#0A84FF]/10 transition-all"
              >
                Посмотреть услуги
              </button>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {miniBenefits.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#151A22]/70 backdrop-blur px-3 py-3"
                >
                  <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-[#0A84FF]/10 border border-[#0A84FF]/30 text-[#00A3FF]">
                    <Icon size={18} />
                  </span>
                  <span className="text-sm font-semibold text-white/90 leading-tight">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#0A84FF]/30 bg-[#151A22] shadow-[0_0_60px_rgba(10,132,255,0.18)]">
              <img
                src={IMAGES.heroPc}
                alt="Игровой ПК с подсветкой"
                className="w-full h-[380px] sm:h-[460px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1116] via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-center gap-3">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#00A3FF]">
                  Флагманская сборка
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-[#0A84FF]/60 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
