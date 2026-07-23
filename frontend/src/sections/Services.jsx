import React from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Package,
  Activity,
  Fan,
  Rocket,
  MonitorDown,
  Laptop,
  MemoryStick,
  Gamepad2,
} from "lucide-react";
import { requestFormPrefill } from "../lib/scroll";

const services = [
  {
    id: "sborka",
    icon: Cpu,
    title: "Сборка ПК",
    formService: "сборка ПК",
    text: "Соберём компьютер под ваши задачи и бюджет. Проверим совместимость комплектующих, аккуратно уложим кабели, настроим систему и протестируем ПК перед выдачей.",
  },
  {
    id: "podbor",
    icon: Package,
    title: "Подбор комплектующих",
    formService: "консультация",
    text: "Подберём оптимальное железо без переплаты. Учтём совместимость, производительность, охлаждение, блок питания и возможность будущего апгрейда.",
  },
  {
    id: "diagnostika",
    icon: Activity,
    title: "Диагностика ПК",
    formService: "диагностика",
    text: "Найдём причину неисправности: перегрев, зависания, ошибки, проблемы с запуском или низкую скорость работы. После проверки предложим понятное решение.",
  },
  {
    id: "chistka",
    icon: Fan,
    title: "Чистка и обслуживание",
    formService: "чистка",
    text: "Почистим компьютер от пыли, заменим термопасту, проверим температуры и систему охлаждения. ПК станет тише, холоднее и стабильнее.",
  },
  {
    id: "apgrade",
    icon: Rocket,
    title: "Апгрейд ПК",
    formService: "апгрейд",
    text: "Улучшим старый компьютер без покупки новой системы. Подберём видеокарту, SSD, оперативную память, процессор или охлаждение под ваш бюджет.",
  },
  {
    id: "windows",
    icon: MonitorDown,
    title: "Установка Windows и ПО",
    formService: "установка Windows",
    text: "Установим Windows, драйверы, обновления и нужные программы. Настроим систему так, чтобы компьютер был готов к работе сразу после выдачи.",
  },
  {
    id: "noutbuki",
    icon: Laptop,
    title: "Обслуживание ноутбуков",
    formService: "чистка",
    text: "Чистка от пыли, замена термопасты и термопрокладок, диагностика и апгрейд SSD/ОЗУ. Ноутбук работает тише, холоднее и стабильнее.",
  },
  {
    id: "videokarty",
    icon: MemoryStick,
    title: "Обслуживание видеокарт",
    formService: "чистка",
    text: "Профессиональная чистка, замена термопасты и термопрокладок, диагностика питания и памяти. Возвращаем видеокарте штатные температуры.",
  },
  {
    id: "consoli",
    icon: Gamepad2,
    title: "Обслуживание игровых консолей",
    formService: "чистка",
    text: "Обслуживание PlayStation и Xbox: чистка от пыли, замена термопасты, диагностика системы охлаждения и стабильности работы.",
  },
];

export default function Services() {
  return (
    <section
      id="uslugi"
      className="relative py-20 sm:py-28 border-t border-white/5"
      data-testid="section-services"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#0A84FF] mb-3">
            Услуги
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            От диагностики до сборки под ключ
          </h2>
          <p className="mt-4 text-base text-[#B7C0CC] max-w-2xl leading-relaxed">
            Работаем с ПК, ноутбуками, видеокартами и игровыми консолями. Обслуживание, апгрейд, установка Windows и ремонт в Энгельсе.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: (i % 3) * 0.06 }}
              className="group relative rounded-2xl bg-[#1B2028] border border-white/10 p-6 hover:border-[#0A84FF]/50 hover:shadow-[0_0_24px_rgba(10,132,255,0.16)] transition-all duration-300 flex flex-col gap-4"
              data-testid={`service-card-${s.id}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-[#0A84FF]/10 border border-[#0A84FF]/35 text-[#00A3FF] group-hover:shadow-[0_0_18px_rgba(10,132,255,0.35)] transition-shadow"
                >
                  <s.icon size={20} />
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {s.title}
                </h3>
              </div>
              <p className="text-sm text-[#B7C0CC] leading-relaxed grow">{s.text}</p>
              <button
                type="button"
                onClick={() =>
                  requestFormPrefill({
                    service: s.formService,
                    comment: `Услуга: ${s.title}.`,
                  })
                }
                data-testid={`service-cta-${s.id}`}
                className="self-start inline-flex items-center rounded-lg border border-[#0A84FF]/55 text-white font-semibold text-sm px-4 py-2 hover:bg-[#0A84FF]/10 hover:border-[#0A84FF] transition-all"
              >
                Оставить заявку
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
