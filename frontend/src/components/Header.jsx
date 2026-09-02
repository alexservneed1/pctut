import React, { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import Logo from "./Logo";
import { NAV_LINKS, SITE } from "../config/site";
import { scrollToId } from "../lib/scroll";
import { trackGoal } from "../lib/analytics";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (e, href) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(href);
  };

  const handleCta = (e) => {
    e.preventDefault();
    setOpen(false);
    scrollToId("zayavka");
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-[#0E1116]/85 border-b border-[#0A84FF]/25"
          : "backdrop-blur-md bg-[#0E1116]/60 border-b border-transparent"
      }`}
      data-testid="site-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[72px] flex items-center justify-between gap-4">
          <a
            href="#glavnaya"
            onClick={(e) => handleNav(e, "#glavnaya")}
            data-testid="header-logo-link"
            className="shrink-0"
          >
            <Logo size="md" />
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleNav(e, l.href)}
                data-testid={`nav-link-${l.href.slice(1)}`}
                className="text-sm font-semibold text-[#B7C0CC] hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={SITE.phone.href}
              onClick={() => trackGoal("phone_click")}
              data-testid="header-phone-link"
              className="hidden xl:inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#00A3FF] transition-colors"
            >
              <Phone size={16} className="text-[#0A84FF]" />
              {SITE.phone.display}
            </a>
            <button
              type="button"
              onClick={handleCta}
              data-testid="header-cta-button"
              className="inline-flex items-center rounded-lg bg-[#0A84FF] text-white font-bold text-sm px-5 py-2.5 shadow-[0_0_15px_rgba(10,132,255,0.4)] hover:shadow-[0_0_25px_rgba(0,163,255,0.6)] hover:bg-[#00A3FF] active:scale-95 transition-all"
            >
              Получить консультацию
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            data-testid="mobile-menu-toggle"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 text-white hover:border-[#0A84FF]/50"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="lg:hidden border-t border-[#0A84FF]/20 bg-[#0E1116]/95 backdrop-blur-xl"
          data-testid="mobile-menu-panel"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col gap-2">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleNav(e, l.href)}
                data-testid={`mobile-nav-link-${l.href.slice(1)}`}
                className="py-3 px-3 rounded-lg text-base font-semibold text-[#B7C0CC] hover:text-white hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <a
              href={SITE.phone.href}
              data-testid="mobile-phone-link"
              className="mt-2 py-3 px-3 rounded-lg text-base font-semibold text-white border border-white/10 flex items-center gap-2"
            >
              <Phone size={16} className="text-[#0A84FF]" />
              {SITE.phone.display}
            </a>
            <button
              type="button"
              onClick={handleCta}
              data-testid="mobile-cta-button"
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-[#0A84FF] text-white font-bold text-base px-5 py-3 shadow-[0_0_15px_rgba(10,132,255,0.4)] hover:bg-[#00A3FF]"
            >
              Получить консультацию
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
