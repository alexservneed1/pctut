// Smooth anchor scrolling that accounts for the sticky header.
export const HEADER_OFFSET = 88;

export function scrollToId(id) {
  if (!id) return;
  const clean = id.startsWith("#") ? id.slice(1) : id;
  const el = document.getElementById(clean);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

// Broadcast a "prefill the lead form" event before scrolling.
export function requestFormPrefill({ service, comment }) {
  window.dispatchEvent(
    new CustomEvent("pktut:prefill-form", { detail: { service, comment } })
  );
  // small delay so the listener can update state before scrolling
  setTimeout(() => scrollToId("zayavka"), 40);
}
