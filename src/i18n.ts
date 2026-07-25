import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { locale } from "@tauri-apps/plugin-os";
import zhCN from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";
import jaJP from "./locales/ja-JP.json";
import koKR from "./locales/ko-KR.json";
import deDE from "./locales/de-DE.json";
import frFR from "./locales/fr-FR.json";
import enUS from "./locales/en-US.json";
import ruRU from "./locales/ru-RU.json";
import hiIN from "./locales/hi-IN.json";
import deCH from "./locales/de-CH.json";
import nlNL from "./locales/nl-NL.json";
import ptBR from "./locales/pt-BR.json";
import esES from "./locales/es-ES.json";

const SUPPORTED = [
  "zh-CN", "zh-TW", "ja-JP", "ko-KR", "de-DE", "de-CH",
  "fr-FR", "en-US", "ru-RU", "hi-IN", "nl-NL", "pt-BR", "es-ES",
] as const;

// Map Windows system locale to a supported language code
export function mapSystemLocale(raw: string | null): string {
  if (!raw) return "en-US";

  const l = raw.replace("_", "-");

  // Exact match
  if ((SUPPORTED as readonly string[]).includes(l)) return l;

  // Normalize: extract primary language tag
  const lang = l.split("-")[0]!.toLowerCase();

  // zh-* special handling: TW/HK/MO/Hant → zh-TW, others → zh-CN
  if (lang === "zh") {
    const region = l.toLowerCase();
    if (["tw", "hk", "mo", "hant", "hans-tw"].some(r => region.includes(r))) {
      return "zh-TW";
    }
    return "zh-CN";
  }

  // Map by primary language
  const LANG_MAP: Record<string, string> = {
    ja: "ja-JP",
    ko: "ko-KR",
    de: l.includes("ch") ? "de-CH" : "de-DE",
    fr: "fr-FR",
    en: "en-US",
    ru: "ru-RU",
    hi: "hi-IN",
    nl: "nl-NL",
    pt: "pt-BR",
    es: "es-ES",
  };

  return LANG_MAP[lang] ?? "en-US";
}

i18n.use(initReactI18next).init({
  resources: {
    "zh-CN": { translation: zhCN },
    "zh-TW": { translation: zhTW },
    "ja-JP": { translation: jaJP },
    "ko-KR": { translation: koKR },
    "de-DE": { translation: deDE },
    "fr-FR": { translation: frFR },
    "en-US": { translation: enUS },
    "ru-RU": { translation: ruRU },
    "hi-IN": { translation: hiIN },
    "de-CH": { translation: deCH },
    "nl-NL": { translation: nlNL },
    "pt-BR": { translation: ptBR },
    "es-ES": { translation: esES },
  },
  lng: "en-US",
  fallbackLng: "en-US",
  interpolation: { escapeValue: false },
});

// On startup: use system language unless user explicitly chose a different one
(async () => {
  const sysLocale = await locale();
  const detected = mapSystemLocale(sysLocale);

  const { load } = await import("@tauri-apps/plugin-store");
  const store = await load("settings.json");
  const saved = await store.get<{ language?: string }>("settings");

  // Only use saved language if the user explicitly chose one that differs
  // from the system detection (prevents the default "zh-CN" from silently
  // overriding the system locale)
  const lang = saved?.language && saved.language !== detected
    ? saved.language
    : detected;

  if (lang !== i18n.language) {
    i18n.changeLanguage(lang);
  }
})();

export default i18n;
