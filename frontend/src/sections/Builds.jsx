import React from "react";
import { motion } from "framer-motion";
import { IMAGES } from "../config/site";
import { requestFormPrefill } from "../lib/scroll";

const builds = [
  {
    id: "home",
    title: "Домашний ПК",
    image: IMAGES.buildHome,
    text: "Для учёбы, интернета, документов и повседневных задач.",
  },
  {
    id: "gaming",
    title: "Игровой ПК",
    image: IMAGES.buildGaming,
    text: "Для CS2, Dota 2, GTA V, Fortnite, War Thunder и современных игр.",
  },
  {
    id: "workstation",
    title: "Рабочая станция",
    image: IMAGES.buildWorkstation,
    text: "Для монтажа, дизайна, 3D, программирования и тяжёлых задач.",
  },
  {
    id: "office",
    title: "Офисный ПК",
    image: IMAGES.buildOffice,
    text: "Для бизнеса, касс, документов, CRM и стабильной работы.",
  },
];

export default function Builds() {
  return (
    <section
      id="sborki"
      className="relative py-20 sm:py-28 border-t border-white/5"
      data-testid="section-builds"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#0A84FF] mb-3">
              Готовые сборки
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Компьютер под любую задачу
            </h2>
          </div>
          <p className="text-sm text-[#B7C0CC] max-w-md">
            Стартовые варианты — адаптируем комплектующие под бюджет и требования.
            Итоговая конфигурация формируется индивидуально.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {builds.map((b, i) => (
            <motion.article
              key={b.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.06 }}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#151A22] border border-white/10 hover:border-[#0A84FF]/50 hover:shadow-[0_0_26px_rgba(10,132,255,0.18)] transition-all duration-300"
              data-testid={`build-card-${b.id}`}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151A22] to-transparent" />
              </div>

              <div className="p-5 flex flex-col gap-3 grow">
                <h3 className="text-lg font-bold text-white">{b.title}</h3>
                <p className="text-sm text-[#B7C0CC] leading-relaxed grow">{b.text}</p>
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#00A3FF]">
                  Цена — по запросу
                </div>
                <button
                  type="button"
                  onClick={() =>
                    requestFormPrefill({
                      service: "сборка ПК",
                      comment: `Интересует «${b.title}».`,
                    })
                  }
                  data-testid={`build-cta-${b.id}`}
                  className="mt-2 inline-flex items-center justify-center rounded-lg bg-[#0A84FF] text-white font-bold text-sm px-4 py-2.5 shadow-[0_0_12px_rgba(10,132,255,0.35)] hover:shadow-[0_0_22px_rgba(0,163,255,0.55)] hover:bg-[#00A3FF] active:scale-[0.98] transition-all"
                >
                  Подобрать сборку
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
