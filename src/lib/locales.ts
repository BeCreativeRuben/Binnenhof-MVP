export const LOCALES = ["nl", "en", "tr", "bg", "ps", "fa", "sk"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "nl";

export const LOCALE_LABELS: Record<Locale, string> = {
  nl: "Nederlands",
  en: "English",
  tr: "Türkçe",
  bg: "Български",
  ps: "پښتو (Pashto)",
  fa: "دری (Dari)",
  sk: "Slovenčina",
};

/** Vlag per taal (emoji) voor taalkiezers */
export const LOCALE_FLAGS: Record<Locale, string> = {
  nl: "🇳🇱",
  en: "🇬🇧",
  tr: "🇹🇷",
  bg: "🇧🇬",
  ps: "🇦🇫",
  fa: "🇦🇫",
  sk: "🇸🇰",
};

export function isLocale(input: string): input is Locale {
  return (LOCALES as readonly string[]).includes(input);
}

