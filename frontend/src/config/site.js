// Central site config — change phone / socials here once, they update everywhere.
export const SITE = {
  brand: "ПК ТУТ",
  city: "Энгельс",
  address: "г. Энгельс, площадь Ленина, д. 20",
  phone: {
    // Client will provide a real number later — replace the two fields below.
    display: "+7 (993) 100-06-03",
    href: "tel:+79931000603",
  },
  hours: "Пн–Пт: 10:00–19:00 · Сб: 10:00–17:00 · Вс: выходной",
  hoursLines: [
    { days: "Пн–Пт", time: "10:00–19:00" },
    { days: "Сб", time: "10:00–17:00" },
    { days: "Вс", time: "выходной" },
  ],
  socials: {
    vk: "https://vk.ru/tutpc",
    telegram: "https://t.me/pc_tut",
    avito:
      "https://www.avito.ru/brands/eb9cc69165a567fa4ad4bf495ced5995/all/bytovaya_elektronika?gdlkerfdnwq=101&page_from=from_item_card_icon&iid=8196133731&sellerId=eb9cc69165a567fa4ad4bf495ced5995",
    // MAX messenger: no deep-link by phone. When the client sends a personal
    // link like https://max.ru/u/... — put it into `url` below and it will be
    // used automatically. Until then, the MAX button falls back to a tel:
    // link labelled with the phone number so users know how to add the contact.
    max: {
      url: "https://max.ru/u/f9LHodD0cOJ2ZvbsyiEXNDsJoOXH1dXkB9-RM0btT9Xm_MkZmGWwMBkVRZQ",
      phoneHref: "tel:+79931000603",
      phoneDisplay: "+7 (993) 100-06-03",
    },
  },
  map: {
    // Yandex Maps constructor iframe (no API key required)
    embedSrc:
      "https://yandex.ru/map-widget/v1/?text=" +
      encodeURIComponent("Энгельс, площадь Ленина, 20") +
      "&z=17",
    routeUrl:
      "https://yandex.ru/maps/?rtext=~" +
      encodeURIComponent("Энгельс, площадь Ленина, 20"),
  },
};

export const NAV_LINKS = [
  { href: "#glavnaya", label: "Главная" },
  { href: "#sborki", label: "Сборки" },
  { href: "#uslugi", label: "Услуги" },
  { href: "#komplektuyushchie", label: "Комплектующие" },
  { href: "#preimushchestva", label: "Преимущества" },
  { href: "#kontakty", label: "Контакты" },
];

export const IMAGES = {
  // Локальные копии в /app/frontend/public/images/ — сайт не зависит от внешнего CDN.
  // Оригиналы загружены с static.prod-images.emergentagent.com одноразово.
  heroPc: "/images/hero-pc.jpeg",
  components: "/images/components.jpeg",
  service: "/images/service.jpeg",
  buildHome: "/images/build-home.jpeg",
  buildGaming: "/images/build-gaming.jpeg",
  buildWorkstation: "/images/build-workstation.jpeg",
  buildOffice: "/images/build-office.jpeg",
};

export const SERVICE_OPTIONS = [
  "сборка ПК",
  "апгрейд",
  "диагностика",
  "чистка",
  "установка Windows",
  "консультация",
];

// --------------------------------------------------------------------------
// Аналитика — вставляется автоматически, если ID заполнены.
// Пустая строка = счётчик выключен, ничего не грузится.
// Как включить:
//   1. Создайте счётчики в Яндекс.Метрика (https://metrika.yandex.ru) и/или
//      Google Analytics 4 (https://analytics.google.com).
//   2. Скопируйте ID и вставьте ниже:
//        yandexMetrikaId:  "12345678"                (только цифры)
//        googleAnalyticsId: "G-XXXXXXXXXX"           (формат G-...)
//   3. Save to GitHub → на VPS: git pull && docker compose up -d --build frontend
//   4. В интерфейсе Метрики создайте JavaScript-цели с идентификаторами:
//        lead_submit  — отправка заявки с формы
//        phone_click  — клик по номеру телефона в шапке/контактах/футере
// --------------------------------------------------------------------------
export const ANALYTICS = {
  yandexMetrikaId: "112190326",
  googleAnalyticsId: "",
};
