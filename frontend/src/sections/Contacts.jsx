import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { SITE } from "../config/site";

export default function Contacts() {
  return (
    <section
      id="kontakty"
      className="relative py-20 sm:py-28 border-t border-white/5"
      data-testid="section-contacts"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#0A84FF] mb-3">
            Контакты
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Контакты ПК ТУТ
          </h2>
          <p className="mt-4 text-base text-[#B7C0CC]">
            Заходите в магазин или пишите — подскажем и подберём.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="lg:col-span-4 flex flex-col gap-4"
          >
            <div className="rounded-2xl bg-[#151A22] border border-white/10 p-6 flex gap-4">
              <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-[#0A84FF]/10 border border-[#0A84FF]/35 text-[#00A3FF]">
                <MapPin size={20} />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#B7C0CC] mb-1">
                  Адрес
                </div>
                <div className="text-white font-semibold">{SITE.address}</div>
              </div>
            </div>

            <a
              href={SITE.phone.href}
              data-testid="contacts-phone-link"
              className="rounded-2xl bg-[#151A22] border border-white/10 p-6 flex gap-4 hover:border-[#0A84FF]/45 transition-colors"
            >
              <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-[#0A84FF]/10 border border-[#0A84FF]/35 text-[#00A3FF]">
                <Phone size={20} />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#B7C0CC] mb-1">
                  Телефон
                </div>
                <div className="text-white font-semibold">{SITE.phone.display}</div>
              </div>
            </a>

            <div className="rounded-2xl bg-[#151A22] border border-white/10 p-6 flex gap-4">
              <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-[#0A84FF]/10 border border-[#0A84FF]/35 text-[#00A3FF]">
                <Clock size={20} />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#B7C0CC] mb-1">
                  Режим работы
                </div>
                <div className="text-white font-semibold">{SITE.hours}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={SITE.socials.vk}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="contacts-vk"
                className="px-4 py-2.5 rounded-lg border border-white/10 hover:border-[#0A84FF]/50 text-sm font-semibold text-white transition-colors"
              >
                VK
              </a>
              <a
                href={SITE.socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="contacts-tg"
                className="px-4 py-2.5 rounded-lg border border-white/10 hover:border-[#0A84FF]/50 text-sm font-semibold text-white transition-colors"
              >
                Telegram
              </a>
              <a
                href={SITE.socials.avito}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="contacts-avito"
                className="px-4 py-2.5 rounded-lg border border-white/10 hover:border-[#0A84FF]/50 text-sm font-semibold text-white transition-colors"
              >
                Avito
              </a>
            </div>

            <a
              href={SITE.map.routeUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contacts-route-button"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A84FF] text-white font-bold px-5 py-3 shadow-[0_0_15px_rgba(10,132,255,0.4)] hover:shadow-[0_0_25px_rgba(0,163,255,0.55)] hover:bg-[#00A3FF] transition-all"
            >
              <Navigation size={16} />
              Построить маршрут
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
            className="lg:col-span-8"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#0A84FF]/25 bg-[#151A22] shadow-[0_0_40px_rgba(10,132,255,0.10)]">
              <iframe
                title="Карта — ПК ТУТ, Энгельс"
                data-testid="yandex-map-iframe"
                src={SITE.map.embedSrc}
                width="100%"
                height="520"
                frameBorder="0"
                allowFullScreen
                style={{ border: 0, display: "block" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
