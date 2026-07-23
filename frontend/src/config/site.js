// Central site config — change phone / socials here once, they update everywhere.
export const SITE = {
  brand: "ПК ТУТ",
  city: "Энгельс",
  address: "г. Энгельс, площадь Ленина, д. 20",
  phone: {
    // Client will provide a real number later — replace the two fields below.
    display: "+7 (___) ___-__-__",
    href: "tel:+7",
  },
  hours: "ежедневно 10:00–20:00",
  socials: {
    vk: "#",
    telegram: "#",
    avito: "#",
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
  heroPc:
    "https://static.prod-images.emergentagent.com/jobs/cb408720-8b84-4d7f-9577-adc2944d3d92/images/3d8e1e53cff13668af972ea61456e7f9f0be966abe176d0c911d1f063e470ab8.jpeg",
  components:
    "https://static.prod-images.emergentagent.com/jobs/cb408720-8b84-4d7f-9577-adc2944d3d92/images/92d73458b97eea23cf3c6ef625df26e46d49bb2e23eb98367771d23003e95e4e.jpeg",
  service:
    "https://static.prod-images.emergentagent.com/jobs/cb408720-8b84-4d7f-9577-adc2944d3d92/images/f4c4ba6c0618499e150e58e66834960b8997a2802381f474b1efd6f6b98ddf73.jpeg",
  buildHome:
    "https://static.prod-images.emergentagent.com/jobs/cb408720-8b84-4d7f-9577-adc2944d3d92/images/7e36d95ef369f176f8b35f1a45b5bf05a336a7d076e6bcc487c540f2f66ab37e.jpeg",
  buildGaming:
    "https://static.prod-images.emergentagent.com/jobs/cb408720-8b84-4d7f-9577-adc2944d3d92/images/7102075cf849120f155c0546aa4fda5e9aed15b128847c9869309a85b1245424.jpeg",
  buildWorkstation:
    "https://static.prod-images.emergentagent.com/jobs/cb408720-8b84-4d7f-9577-adc2944d3d92/images/e9242a472d8d53f0abecb1c294e0056c6c8c4eee3d929fc872f0f8f5d6c2683b.jpeg",
  buildOffice:
    "https://static.prod-images.emergentagent.com/jobs/cb408720-8b84-4d7f-9577-adc2944d3d92/images/3978e375d5c6fc8d3ec5dc1d15ef68db38d5546d3091ce36267bf5e5570c4d9d.jpeg",
};

export const SERVICE_OPTIONS = [
  "сборка ПК",
  "апгрейд",
  "диагностика",
  "чистка",
  "установка Windows",
  "консультация",
];
