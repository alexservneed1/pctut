import React from "react";
import { motion } from "framer-motion";
import { PCBConnector } from "../components/PCBTrace";

const steps = [
  { n: "01", title: "Вы оставляете заявку", text: "Форма на сайте или звонок — расскажите, что нужно." },
  { n: "02", title: "Уточняем задачи и бюджет", text: "Задаём короткие вопросы, чтобы понять сценарии и рамки." },
  { n: "03", title: "Подбираем решение", text: "Собираем конфигурацию, проверяем совместимость, согласуем." },
  { n: "04", title: "Собираем и выдаём", text: "Собираем, настраиваем и тестируем ПК — забираете готовый." },
];

export default function Process() {
  return (
    <section
      className="relative py-20 sm:py-28 border-t border-white/5"
      data-testid="section-process"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#0A84FF] mb-3">
            Как мы работаем
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Прозрачный процесс — от заявки до готового ПК
          </h2>
        </div>

        <div className="relative">
          <PCBConnector />
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.1 }}
                className="relative rounded-2xl bg-[#151A22] border border-white/10 p-6 hover:border-[#0A84FF]/45 transition-colors"
                data-testid={`process-step-${i + 1}`}
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#0A84FF]/10 border border-[#0A84FF]/40 text-[#00A3FF] font-extrabold text-lg shadow-[0_0_16px_rgba(10,132,255,0.35)] mb-5">
                  {s.n}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-[#B7C0CC] leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
