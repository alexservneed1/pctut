# «ПК ТУТ» — Landing site & lead-capture — PRD

## Original problem statement
Build a Russian-language premium dark-tech landing page for «ПК ТУТ» — computer store & service in Engels (address: г. Энгельс, площадь Ленина, 20). Marketing site with lead-capture form, hidden admin page, optional VK notification integration. FARM stack (FastAPI + React + MongoDB).

## Architecture
- **Frontend**: React 19, Tailwind CSS, framer-motion, lucide-react, sonner (toasts), react-router-dom. Fonts: Manrope + Montserrat (Cyrillic subset). Palette: #0E1116 background, #0A84FF/#00A3FF blue neon, #FFFFFF/#B7C0CC text.
- **Backend**: FastAPI on 0.0.0.0:8001 (supervisor). All routes under `/api`. Motor async MongoDB driver. `openapi_url=/api/openapi.json`.
- **DB**: MongoDB collection `leads` — UUID `id`, `name`, `phone`, `service`, `comment`, `status` (new|processed), `created_at` (UTC ISO string).
- **Auth**: Admin endpoints protected by `X-Admin-Token` header matching env `ADMIN_TOKEN=pktut2025admin`.

## User personas
1. **Visitor** — potential customer in Engels looking for a PC build, upgrade, or repair. Submits the lead form.
2. **Owner / Admin** — accesses hidden `/admin` with token, sees inbound leads, toggles status.

## Core requirements (static)
- Single-page landing in Russian with anchor navigation.
- 10 sections: header, hero, what-we-do, builds (4 cards), services (9 cards), benefits (6), process (4 steps + PCB trace), lead form, contacts (Yandex map + route button), footer.
- Sticky glassmorphic header with mobile hamburger.
- Custom SVG logo «ПК ТУТ» with blue neon frame around «ТУТ».
- Form prefill from build/service card CTAs via CustomEvent.
- Hidden `/admin` route with token-based access, table + status toggle.
- SEO: `<html lang="ru">`, RU title/description, Open Graph tags.
- Responsive (375 / 768 / 1440).

## What's been implemented (2026-07-23)
- ✅ Backend: `POST /api/leads`, `GET /api/leads` (admin), `PATCH /api/leads/{id}` (admin), `/api/openapi.json`, `/api/health`.
- ✅ VK notification helper (silent skip if `VK_TOKEN`/`VK_PEER_ID` unset).
- ✅ Frontend: all 10 sections, sticky header, mobile menu, animations, PCB decor.
- ✅ Lead form with `+7 (XXX) XXX-XX-XX` mask, Russian validation.
- ✅ Build & service card CTAs prefill form and scroll.
- ✅ Yandex map iframe + «Построить маршрут» button.
- ✅ Hidden `/admin` page with token login (localStorage), leads table, status toggle.
- ✅ Central config `/app/frontend/src/config/site.js` for easy phone/socials swap.
- ✅ Testing agent — 17/17 backend passing, all critical frontend flows verified.

## Backlog (P1/P2)
- **P1**: Add real phone number & socials URLs (single-file config edit in `site.js`).
- **P1**: Enable VK notifications by setting `VK_TOKEN` + `VK_PEER_ID` in `backend/.env`.
- **P2**: Add lead deletion / archive endpoint + admin UI.
- **P2**: Add admin CSV export.
- **P2**: Add Telegram bot / email fallback notification.
- **P2**: Real prices on build cards (currently «Цена — по запросу»).
- **P3**: Structured data (schema.org LocalBusiness) for local SEO.

## Test credentials
See `/app/memory/test_credentials.md`. Admin token: `pktut2025admin` (header `X-Admin-Token`).
