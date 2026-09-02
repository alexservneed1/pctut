import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { CheckCircle2, Send, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { SERVICE_OPTIONS } from "../config/site";
import { API } from "../lib/api";
import { trackGoal } from "../lib/analytics";

// Format keystrokes into "+7 (XXX) XXX-XX-XX"
function formatRuPhone(input) {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits[0] === "8") digits = "7" + digits.slice(1);
  if (digits[0] !== "7") digits = "7" + digits;
  digits = digits.slice(0, 11);
  const d = digits.slice(1); // after leading 7
  let out = "+7";
  if (d.length > 0) out += " (" + d.slice(0, 3);
  if (d.length >= 3) out += ") " + d.slice(3, 6);
  if (d.length >= 6) out += "-" + d.slice(6, 8);
  if (d.length >= 8) out += "-" + d.slice(8, 10);
  return out;
}

function countPhoneDigits(v) {
  return (v.match(/\d/g) || []).length;
}

export default function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef(null);

  // Listen for prefill events from build / service card CTAs.
  useEffect(() => {
    const onPrefill = (e) => {
      const { service: s, comment: c } = e.detail || {};
      if (s && SERVICE_OPTIONS.includes(s)) setService(s);
      if (c) setComment(c);
      setSuccess(false);
    };
    window.addEventListener("pktut:prefill-form", onPrefill);
    return () => window.removeEventListener("pktut:prefill-form", onPrefill);
  }, []);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Укажите имя";
    if (countPhoneDigits(phone) < 11) errs.phone = "Введите телефон полностью";
    if (!SERVICE_OPTIONS.includes(service)) errs.service = "Выберите услугу";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/leads`, {
        name: name.trim(),
        phone: phone.trim(),
        service,
        comment: comment.trim(),
      });
      setSuccess(true);
      setName("");
      setPhone("");
      setComment("");
      setService(SERVICE_OPTIONS[0]);
      toast.success("Заявка отправлена!");
      trackGoal("lead_submit");
    } catch (err) {
      console.error(err);
      toast.error("Не удалось отправить заявку. Попробуйте позже или позвоните нам.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="zayavka"
      className="relative py-20 sm:py-28 border-t border-white/5"
      data-testid="section-lead-form"
    >
      {/* subtle blue ambient */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-16 h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(10,132,255,0.20), transparent 60%)",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#0A84FF] mb-3">
              Заявка
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Подберём ПК под твои задачи
            </h2>
            <p className="mt-5 text-base text-[#B7C0CC] max-w-md leading-relaxed">
              Расскажите, для чего нужен компьютер — мы предложим оптимальное решение
              без лишних затрат.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-[#B7C0CC]">
              {["Отвечаем в течение рабочего дня", "Помогаем без обязательств", "Никакого спама"].map(
                (t) => (
                  <li key={t} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-[#00A3FF]" /> {t}
                  </li>
                )
              )}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
            className="lg:col-span-7"
          >
            <div className="relative rounded-2xl bg-[#151A22] border border-white/10 p-6 sm:p-8 shadow-[0_0_40px_rgba(10,132,255,0.08)]">
              {success ? (
                <div
                  className="min-h-[360px] flex flex-col items-center justify-center text-center gap-4"
                  data-testid="lead-form-success"
                >
                  <div className="w-16 h-16 rounded-full inline-flex items-center justify-center bg-[#0A84FF]/15 border border-[#0A84FF]/45 text-[#00A3FF] shadow-[0_0_28px_rgba(10,132,255,0.45)]">
                    <CheckCircle2 size={30} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Заявка отправлена!
                  </h3>
                  <p className="text-[#B7C0CC] max-w-md">
                    Мы свяжемся с вами в ближайшее время.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    data-testid="lead-form-reset"
                    className="mt-2 inline-flex items-center rounded-lg border border-[#0A84FF]/55 text-white font-semibold text-sm px-5 py-2.5 hover:bg-[#0A84FF]/10"
                  >
                    Отправить ещё одну
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={onSubmit} noValidate data-testid="lead-form">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="lf-name"
                        className="text-xs font-bold uppercase tracking-[0.12em] text-[#B7C0CC]"
                      >
                        Имя *
                      </label>
                      <input
                        id="lf-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        data-testid="lead-input-name"
                        placeholder="Как к вам обращаться"
                        className={`bg-[#0E1116] border rounded-lg px-4 py-3 text-white placeholder:text-white/30 outline-none transition-colors ${
                          errors.name
                            ? "border-red-500/60"
                            : "border-white/10 focus:border-[#0A84FF]"
                        }`}
                      />
                      {errors.name && (
                        <span className="text-xs text-red-400 flex items-center gap-1">
                          <AlertTriangle size={12} /> {errors.name}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="lf-phone"
                        className="text-xs font-bold uppercase tracking-[0.12em] text-[#B7C0CC]"
                      >
                        Телефон *
                      </label>
                      <input
                        id="lf-phone"
                        type="tel"
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => setPhone(formatRuPhone(e.target.value))}
                        onFocus={(e) => {
                          if (!e.target.value) setPhone("+7 ");
                        }}
                        data-testid="lead-input-phone"
                        placeholder="+7 (___) ___-__-__"
                        className={`bg-[#0E1116] border rounded-lg px-4 py-3 text-white placeholder:text-white/30 outline-none transition-colors ${
                          errors.phone
                            ? "border-red-500/60"
                            : "border-white/10 focus:border-[#0A84FF]"
                        }`}
                      />
                      {errors.phone && (
                        <span className="text-xs text-red-400 flex items-center gap-1">
                          <AlertTriangle size={12} /> {errors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-1.5">
                    <label
                      htmlFor="lf-service"
                      className="text-xs font-bold uppercase tracking-[0.12em] text-[#B7C0CC]"
                    >
                      Что нужно *
                    </label>
                    <select
                      id="lf-service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      data-testid="lead-select-service"
                      className="bg-[#0E1116] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#0A84FF] transition-colors"
                    >
                      {SERVICE_OPTIONS.map((o) => (
                        <option key={o} value={o} className="bg-[#0E1116]">
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4 flex flex-col gap-1.5">
                    <label
                      htmlFor="lf-comment"
                      className="text-xs font-bold uppercase tracking-[0.12em] text-[#B7C0CC]"
                    >
                      Комментарий
                    </label>
                    <textarea
                      id="lf-comment"
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      data-testid="lead-input-comment"
                      placeholder="Опишите задачи, бюджет или пожелания"
                      className="bg-[#0E1116] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#0A84FF] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    data-testid="lead-form-submit"
                    className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A84FF] text-white font-bold px-6 py-3.5 shadow-[0_0_18px_rgba(10,132,255,0.4)] hover:shadow-[0_0_30px_rgba(0,163,255,0.6)] hover:bg-[#00A3FF] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                    {submitting ? "Отправка…" : "Отправить заявку"}
                  </button>

                  <p className="mt-4 text-xs text-[#8A94A6]">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных для связи по вашей заявке.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
