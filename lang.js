// LANGUAGE DROPDOWN + I18N
const langDropdown = document.querySelector(".lang-dropdown");
const langCurrent  = document.querySelector(".lang-current");
const langMenuItems = document.querySelectorAll(".lang-menu li");

// SUPPORTED LANGUAGES
const SUPPORTED_LANGS = ["en", "sr", "de"];
const DEFAULT_LANG = "en";

// CACHE
const translationsCache = {};

// LOAD JSON
async function loadTranslations(lang) {
    if (translationsCache[lang]) return translationsCache[lang];

    try {
        const res = await fetch(`lang/${lang}.json`);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        translationsCache[lang] = data;
        return data;
    } catch (err) {
        console.error("Cannot load translations for:", lang, err);
        return {};
    }
}

// TEXT FOR data-i18n
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

// LANG FLAGS
function updateLangDropdownUI(lang) {
    const currentFlag = langCurrent.querySelector(".flag");
    const currentCode = langCurrent.querySelector(".lang-code");

    if (currentFlag) {
        currentFlag.className = `flag flag-${lang}`;
    }
    if (currentCode) {
        currentCode.textContent = lang.toUpperCase();
    }
}

// LANG SET
async function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;

    localStorage.setItem("lang", lang);
    updateLangDropdownUI(lang);
    await applyTranslations(lang);

    document.documentElement.lang = lang;
}

if (langDropdown && langCurrent) {
    const savedLang = localStorage.getItem("lang") || DEFAULT_LANG;
    setLanguage(savedLang);

    // OPEN/CLOSE DROPDOWN
    langCurrent.addEventListener("click", () => {
        langDropdown.classList.toggle("open");
    });

    langMenuItems.forEach(item => {
        item.addEventListener("click", () => {
            const lang = item.dataset.lang || DEFAULT_LANG;

            langDropdown.classList.remove("open");
            setLanguage(lang);
        });
    });

    document.addEventListener("click", (e) => {
        if (!langDropdown.contains(e.target)) {
            langDropdown.classList.remove("open");
        }
    });
}