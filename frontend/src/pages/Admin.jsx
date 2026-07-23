import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { LogOut, RefreshCw, Shield, CheckCircle2, Clock3 } from "lucide-react";
import { toast } from "sonner";
import Logo from "../components/Logo";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LS_KEY = "pktut-admin-token";

function fmtDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(LS_KEY) || "");
  const [inputToken, setInputToken] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLeads = useCallback(async (t) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${API}/leads`, {
        headers: { "X-Admin-Token": t },
      });
      setLeads(data);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        setError("Неверный токен. Проверьте и попробуйте снова.");
        setToken("");
        localStorage.removeItem(LS_KEY);
      } else {
        setError("Не удалось загрузить заявки. Повторите попытку позже.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchLeads(token);
  }, [token, fetchLeads]);

  const handleLogin = (e) => {
    e.preventDefault();
    const t = inputToken.trim();
    if (!t) return;
    localStorage.setItem(LS_KEY, t);
    setToken(t);
    setInputToken("");
  };

  const handleLogout = () => {
    localStorage.removeItem(LS_KEY);
    setToken("");
    setLeads([]);
  };

  const toggleStatus = async (lead) => {
    const next = lead.status === "new" ? "processed" : "new";
    try {
      const { data } = await axios.patch(
        `${API}/leads/${lead.id}`,
        { status: next },
        { headers: { "X-Admin-Token": token } }
      );
      setLeads((cur) => cur.map((l) => (l.id === lead.id ? data : l)));
      toast.success(next === "processed" ? "Заявка отмечена как обработанная" : "Заявка возвращена в новые");
    } catch (e) {
      toast.error("Не удалось обновить статус");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0E1116] text-white flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          data-testid="admin-login-form"
          className="w-full max-w-md rounded-2xl bg-[#151A22] border border-white/10 p-8 shadow-[0_0_40px_rgba(10,132,255,0.12)]"
        >
          <div className="flex items-center justify-between mb-6">
            <Logo size="md" />
            <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#0A84FF] flex items-center gap-2">
              <Shield size={14} /> Админ
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Вход в панель</h1>
          <p className="text-sm text-[#B7C0CC] mb-5">
            Введите токен доступа. Он будет сохранён локально в браузере.
          </p>
          <label
            htmlFor="admin-token"
            className="text-xs font-bold uppercase tracking-[0.12em] text-[#B7C0CC]"
          >
            Токен
          </label>
          <input
            id="admin-token"
            type="password"
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            data-testid="admin-token-input"
            placeholder="X-Admin-Token"
            className="mt-1.5 w-full bg-[#0E1116] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#0A84FF] transition-colors"
            autoFocus
          />
          {error && (
            <div
              className="mt-4 text-sm text-red-400"
              data-testid="admin-login-error"
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            data-testid="admin-login-submit"
            className="mt-6 w-full inline-flex items-center justify-center rounded-lg bg-[#0A84FF] text-white font-bold py-3 shadow-[0_0_15px_rgba(10,132,255,0.4)] hover:bg-[#00A3FF] transition-all"
          >
            Войти
          </button>
        </form>
      </div>
    );
  }

  const newCount = leads.filter((l) => l.status === "new").length;

  return (
    <div className="min-h-screen bg-[#0E1116] text-white">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0E1116]/85 border-b border-[#0A84FF]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="md" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-[0.15em] text-[#0A84FF]">
              Панель · Заявки
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchLeads(token)}
              data-testid="admin-refresh-button"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 hover:border-[#0A84FF]/50 px-3 py-2 text-sm font-semibold"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Обновить
            </button>
            <button
              type="button"
              onClick={handleLogout}
              data-testid="admin-logout-button"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 hover:border-red-500/50 px-3 py-2 text-sm font-semibold"
            >
              <LogOut size={14} /> Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-end gap-4 justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Заявки</h1>
            <p className="text-sm text-[#B7C0CC] mt-1">
              Всего: <span className="text-white font-semibold">{leads.length}</span> · Новых:{" "}
              <span className="text-[#00A3FF] font-semibold">{newCount}</span>
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-400" data-testid="admin-error">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-[#151A22] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="admin-leads-table">
              <thead className="bg-[#1B2028] text-[#B7C0CC]">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Дата</th>
                  <th className="text-left px-4 py-3 font-semibold">Имя</th>
                  <th className="text-left px-4 py-3 font-semibold">Телефон</th>
                  <th className="text-left px-4 py-3 font-semibold">Услуга</th>
                  <th className="text-left px-4 py-3 font-semibold">Комментарий</th>
                  <th className="text-left px-4 py-3 font-semibold">Статус</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-[#B7C0CC]">
                      Пока нет заявок.
                    </td>
                  </tr>
                )}
                {leads.map((l) => (
                  <tr
                    key={l.id}
                    data-testid={`admin-lead-row-${l.id}`}
                    className="border-t border-white/5 hover:bg-white/[0.02] align-top"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-[#B7C0CC]">
                      {fmtDate(l.created_at)}
                    </td>
                    <td className="px-4 py-3 font-semibold">{l.name}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`tel:${l.phone.replace(/\s|\(|\)|-/g, "")}`}
                        className="hover:text-[#00A3FF]"
                      >
                        {l.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-[#B7C0CC]">{l.service}</td>
                    <td className="px-4 py-3 text-[#B7C0CC] max-w-xs">
                      {l.comment || <span className="text-white/30">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleStatus(l)}
                        data-testid={`admin-lead-status-${l.id}`}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border transition-all ${
                          l.status === "new"
                            ? "border-[#0A84FF]/50 text-[#00A3FF] bg-[#0A84FF]/10 hover:bg-[#0A84FF]/20"
                            : "border-emerald-500/40 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20"
                        }`}
                      >
                        {l.status === "new" ? (
                          <>
                            <Clock3 size={12} /> новая
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={12} /> обработана
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
