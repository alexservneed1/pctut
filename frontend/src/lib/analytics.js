// Аналитика: Яндекс.Метрика + Google Analytics 4.
// Загружается динамически при старте приложения. При пустых ID (в site.js)
// ничего не подгружается и функции trackGoal становятся no-op.
//
// Как использовать в коде:
//   import { trackGoal } from "../lib/analytics";
//   trackGoal("lead_submit");
//   trackGoal("phone_click");

import { ANALYTICS } from "../config/site";

let initialized = false;

const injectYandexMetrika = (id) => {
  // Официальный сниппет Метрики (адаптирован под ES-модуль).
  /* eslint-disable */
  (function (m, e, t, r, i, k, a) {
    m[i] =
      m[i] ||
      function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) return;
    }
    k = e.createElement(t);
    a = e.getElementsByTagName(t)[0];
    k.async = 1;
    k.src = r;
    a.parentNode.insertBefore(k, a);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  /* eslint-enable */

  window.ym(id, "init", {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: "dataLayer",
    accurateTrackBounce: true,
    trackLinks: true,
    referrer: document.referrer,
    url: location.href,
  });

  // noscript-пиксель для клиентов без JS.
  const ns = document.createElement("noscript");
  ns.innerHTML =
    `<div><img src="https://mc.yandex.ru/watch/${id}" ` +
    `style="position:absolute;left:-9999px" alt="" /></div>`;
  document.body.appendChild(ns);
};

const injectGoogleAnalytics = (id) => {
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id);
};

export const initAnalytics = () => {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    if (ANALYTICS.yandexMetrikaId) {
      injectYandexMetrika(ANALYTICS.yandexMetrikaId);
    }
    if (ANALYTICS.googleAnalyticsId) {
      injectGoogleAnalytics(ANALYTICS.googleAnalyticsId);
    }
  } catch (e) {
    // Аналитика не должна ломать сайт.
    // eslint-disable-next-line no-console
    console.warn("analytics init failed:", e);
  }
};

// Безопасный no-op, если счётчики не подключены.
export const trackGoal = (name) => {
  if (!name || typeof window === "undefined") return;
  try {
    if (ANALYTICS.yandexMetrikaId && typeof window.ym === "function") {
      window.ym(ANALYTICS.yandexMetrikaId, "reachGoal", name);
    }
    if (ANALYTICS.googleAnalyticsId && typeof window.gtag === "function") {
      window.gtag("event", name);
    }
  } catch (e) {
    // ignore
  }
};
