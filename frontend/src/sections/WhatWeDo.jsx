import React from "react";
import { motion } from "framer-motion";
import { Cpu, Package, Wrench } from "lucide-react";
import { IMAGES } from "../config/site";

const cards = [
  {
    id: "sborka",
    icon: Cpu,
    title: "Сборка ПК",
    image: IMAGES.buildGaming,
    text: "Соберём компьютер с нуля под игры, работу, учёбу или монтаж. Подберём комплектующие, аккуратно соберём, настроим и проверим.",
  },
  {
    id: "komplektuyushchie",
    icon: Package,
    title: "Комплектующие",
    image: IMAGES.components,
    text: "Поможем выбрать видеокарту, процессор, SSD, ОЗУ, материнскую плату, корпус, блок питания и периферию без лишней переплаты.",
  },
  {
    id: "servis",
    icon: Wrench,
    title: "Сервис",
    image: IMAGES.service,
    text: "Диагностика, чистка, апгрейд, замена термопасты, установка Windows, драйверов и программ.",
  },
];

export default function WhatWeDo() {
  return (
    <section
      className="relative py-20 sm:py-28"
      data-testid="section-what-we-do"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#0A84FF] mb-3">
            Что мы делаем
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Магазин, сборка и сервис — <span className="text-[#00A3FF]">под ключ</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <motion.article
              key={c.id}
              id={c.id === "komplektuyushchie" ? "komplektuyushchie" : undefined}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.08 }}
              className="group relative rounded-2xl overflow-hidden bg-[#151A22] border border-white/10 hover:border-[#0A84FF]/50 hover:shadow-[0_0_28px_rgba(10,132,255,0.18)] transition-all duration-300"
              data-testid={`what-we-do-card-${c.id}`}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151A22] via-[#151A22]/40 to-transparent" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-lg bg-[#0E1116]/70 border border-[#0A84FF]/40 px-3 py-1.5 backdrop-blur">
                  <c.icon size={16} className="text-[#00A3FF]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {c.title}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
                <p className="text-sm text-[#B7C0CC] leading-relaxed">{c.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
