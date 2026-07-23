import React from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import Logo from "./Logo";
import { SITE } from "../config/site";

const SocialButton = ({ label, href, testId, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    data-testid={testId}
    aria-label={label}
    className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-white/10 text-[#B7C0CC] hover:text-white hover:border-[#0A84FF]/50 hover:shadow-[0_0_15px_rgba(10,132,255,0.35)] transition-all"
  >
    {children}
  </a>
);

export default function Footer() {
  return (
    <footer
      className="relative border-t border-[#0A84FF]/20 bg-[#0B0D12]"
      data-testid="site-footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <Logo size="md" />
          <p className="mt-4 text-sm text-[#B7C0CC] leading-relaxed max-w-xs">
            Компьютеры, комплектующие и сервис в Энгельсе
          </p>
          <div className="mt-5 flex gap-3">
            <SocialButton label="VK" href={SITE.socials.vk} testId="footer-vk">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.7 17.3h1c.3 0 .5-.2.7-.5v-1.2c0-.5.4-.7.7-.5.8.5 1.7 1.6 2 2.1.2.3.4.5.9.5h1.7c.9 0 1.3-.4.7-1.2-.9-1.2-2.1-2.6-2.3-2.9-.4-.4-.3-.5 0-.9.1 0 2.2-3.1 2.4-4.1.1-.4-.1-.6-.5-.6h-1.7c-.4 0-.6.2-.7.5 0 0-.9 2.1-2.1 3.5-.4.4-.6.5-.8.5-.2 0-.3-.1-.3-.5V8.6c0-.5-.1-.7-.5-.7h-2.7c-.3 0-.5.2-.5.5 0 .5.7.6.7 1.9v2.6c0 .5-.1.7-.3.7-.5 0-1.8-2.1-2.6-4.6-.2-.5-.3-.7-.8-.7H5.6c-.6 0-.7.3-.7.6 0 .5.7 3 3.1 6.2 1.5 2.3 3.7 3.4 5.7 3.4z"/>
              </svg>
            </SocialButton>
            <SocialButton label="Telegram" href={SITE.socials.telegram} testId="footer-tg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9.9 15.2 9.7 18c.3 0 .5-.1.7-.3l1.7-1.6 3.5 2.5c.6.4 1.1.2 1.3-.6l2.4-11.3c.2-.9-.3-1.3-1-1L4.9 10c-.9.3-.9.9-.2 1.1l3.6 1.1 8.3-5.2c.4-.3.8-.1.5.2l-7.2 8z"/>
              </svg>
            </SocialButton>
            <SocialButton label="Avito" href={SITE.socials.avito} testId="footer-avito">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="8" cy="8" r="3.5" />
                <circle cx="17" cy="8" r="2.5" />
                <circle cx="8" cy="17" r="2.5" />
                <circle cx="17" cy="17" r="3.5" />
              </svg>
            </SocialButton>
          </div>
        </div>

        <div className="text-sm text-[#B7C0CC] space-y-3">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#0A84FF]">
            Контакты
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={16} className="mt-0.5 text-[#0A84FF] shrink-0" />
            <span>{SITE.address}</span>
          </div>
          <a
            href={SITE.phone.href}
            data-testid="footer-phone-link"
            className="flex items-center gap-3 hover:text-white transition-colors"
          >
            <Phone size={16} className="text-[#0A84FF]" />
            <span>{SITE.phone.display}</span>
          </a>
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-[#0A84FF]" />
            <span>{SITE.hours}</span>
          </div>
        </div>

        <div className="text-sm text-[#B7C0CC] space-y-3">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#0A84FF]">
            Навигация
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            <a href="#sborki" className="hover:text-white">Сборки</a>
            <a href="#uslugi" className="hover:text-white">Услуги</a>
            <a href="#komplektuyushchie" className="hover:text-white">Комплектующие</a>
            <a href="#preimushchestva" className="hover:text-white">Преимущества</a>
            <a href="#kontakty" className="hover:text-white">Контакты</a>
            <a href="#zayavka" className="hover:text-white">Заявка</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs text-[#8A94A6] flex flex-col md:flex-row justify-between gap-2">
          <div>© 2025 ПК ТУТ. Все права защищены.</div>
          <div>Компьютерный магазин и сервис в Энгельсе</div>
        </div>
      </div>
    </footer>
  );
}
