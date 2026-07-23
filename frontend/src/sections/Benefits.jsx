import React from "react";
import { motion } from "framer-motion";
import { Target, Coins, PlugZap, FlaskConical, MessagesSquare, ShieldCheck } from "lucide-react";

const benefits = [
  { icon: Target, title: "Подбираем под задачу, а не просто продаём" },
  { icon: Coins, title: "Не заставляем переплачивать" },
  { icon: PlugZap, title: "Проверяем совместимость комплектующих" },
  { icon: FlaskConical, title: "Тестируем ПК перед выдачей" },
  { icon: MessagesSquare, title: "Объясняем простым языком" },
  { icon: ShieldCheck, title: "Даём гарантию на работы" },
];

export default function Benefits() {
  return (
    <section
      id="preimushchestva"
      className="relative py-20 sm:py-28 border-t border-white/5"
      data-testid="section-benefits"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#0A84FF] mb-3">
              Преимущества
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Почему выбирают <span className="text-[#00A3FF]">ПК ТУТ</span>
            </h2>
            <p className="mt-5 text-base text-[#B7C0CC] leading-relaxed">
              Мы делаем понятный сервис для тех, кто хочет получить рабочий и стабильный ПК —
              без сюрпризов и лишних затрат.
            </p>
          </div>

          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
            {benefits.map(({ icon: Icon, title }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
                className="flex items-start gap-4 rounded-2xl bg-[#151A22] border border-white/10 p-5 hover:border-[#0A84FF]/45 hover:shadow-[0_0_20px_rgba(10,132,255,0.14)] transition-all"
                data-testid={`benefit-card-${i}`}
              >
                <span className="inline-flex w-11 h-11 shrink-0 items-center justify-center rounded-xl bg-[#0A84FF]/10 border border-[#0A84FF]/35 text-[#00A3FF]">
                  <Icon size={20} />
                </span>
                <div className="text-base font-semibold text-white leading-snug pt-1.5">
                  {title}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
