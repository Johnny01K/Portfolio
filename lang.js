// lang.js (multi-dropdown + i18n)
const allLangDropdowns = document.querySelectorAll(".lang-dropdown");

// SUPPORTED LANGUAGES
const SUPPORTED_LANGS = ["en", "sr", "de"];
const DEFAULT_LANG = "en";

// CACHE JSON prevoda
const translationsCache = {};

// LOAD JSON
async function loadTranslations(lang) {
  if (translationsCache[lang]) return translationsCache[lang];
  try {
    const res = await fetch(`lang/${lang}.json`, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    translationsCache[lang] = data;
    return data;
  } catch (err) {
    console.error("Cannot load translations for:", lang, err);
    return {};
  }
}

// APPLY TEXT [data-i18n]
async function applyTranslations(lang) {
  const dict = await loadTranslations(lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const txt = dict[key];
    if (!txt) return;

    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = txt;
    } else {
      el.textContent = txt;
    }
  });
}

// UPDATE UI - DROPDOWN
function updateAllLangDropdownUI(lang) {
  allLangDropdowns.forEach((dd) => {
    const codeEl = dd.querySelector(".lang-code");
    const flagEl = dd.querySelector(".flag");
    if (codeEl) codeEl.textContent = lang.toUpperCase();
    if (flagEl) {
      // reset klasa
      flagEl.className = "flag";
      if (lang === "en") flagEl.classList.add("flag-en");
      if (lang === "sr") flagEl.classList.add("flag-sr");
      if (lang === "de") flagEl.classList.add("flag-de");
    }
  });
}

function closeAllLangMenus(except = null) {
  allLangDropdowns.forEach((dd) => {
    if (dd !== except) dd.classList.remove("open");
  });
}

async function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
  localStorage.setItem("lang", lang);
  updateAllLangDropdownUI(lang);
  await applyTranslations(lang);
  document.documentElement.lang = lang;
}

// INIT
(function initI18n() {
  const saved = (localStorage.getItem("lang") || DEFAULT_LANG).toLowerCase();
  setLanguage(saved);

  if (!allLangDropdowns.length) return;

  allLangDropdowns.forEach((dd) => {
    const btn = dd.querySelector(".lang-current");
    const items = dd.querySelectorAll(".lang-menu li");

    if (btn) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dd.classList.contains("open");
        closeAllLangMenus(dd);
        if (!isOpen) dd.classList.add("open");
        else dd.classList.remove("open");
      });
    }

    items.forEach((li) => {
      li.addEventListener("click", async (e) => {
        e.stopPropagation();
        const lang = (li.getAttribute("data-lang") || DEFAULT_LANG).toLowerCase();
        closeAllLangMenus();
        await setLanguage(lang);
      });
    });
  });

  document.addEventListener("click", () => closeAllLangMenus());

  allLangDropdowns.forEach((dd) => {
    dd.addEventListener("click", (e) => e.stopPropagation());
  });
})();
