import type { Locale } from "@/lib/locales";

type Dictionary = Record<string, string>;

const UI_NL: Dictionary = {
  "app.name": "Binnenhof Connect",
  "login.title": "Inloggen (prototype)",
  "login.subtitle":
    "Kies een rol en taal. Dit is een demo-login met mock data.",
  "login.role": "Rol",
  "login.language": "Taal",
  "login.user": "Account",
  "login.continue": "Verder",
  "nav.dashboard": "Start",
  "nav.messages": "Berichten",
  "nav.agenda": "Agenda",
  "nav.workshops": "Workshops",
  "nav.kieswijzer": "Kieswijzer",
  "nav.assignments": "Opdrachtjes",
  "common.back": "Terug",
  "common.logout": "Uitloggen",
  "common.optional": "Optioneel",
  "common.search": "Zoeken",
  "dashboard.welcome": "Welkom",
  "dashboard.quickActions": "Snelle acties",
  "dashboard.latest": "Laatste updates",
  "messages.title": "Berichten",
  "messages.new": "Nieuw bericht",
  "messages.context": "Context",
  "messages.reply": "Reageren",
  "agenda.title": "Agenda",
  "agenda.upcoming": "Komende items",
  "workshops.title": "Workshops",
  "workshops.emailPreview": "E-mail preview",
  "kieswijzer.title": "Kieswijzer",
  "kieswijzer.subtitle":
    "Kies wat bij jou past. Je krijgt een ranglijst met mogelijke richtingen.",
  "kieswijzer.start": "Start quiz",
  "kieswijzer.results": "Resultaten",
  "student.assignments.title": "Opdrachtjes",
  "student.assignments.subtitle":
    "Korte spelletjes en taken. Je resultaten worden bewaard in dit prototype (op dit toestel).",
  "teacher.title": "Leerkracht",
  "parent.title": "Ouder/Voogd",
  "student.title": "Leerling",
};

function mockTranslateText(locale: Locale, textNl: string): string {
  if (locale === "nl") return textNl;
  // Prototype: "auto-vertaling" zonder externe API.
  // Voor demo is dit bewust voorspelbaar, zodat gebruikers zien dat er vertaald wordt.
  const label =
    locale === "en"
      ? "EN"
      : locale === "tr"
        ? "TR"
        : locale === "bg"
          ? "BG"
          : locale === "sk"
            ? "SK"
            : locale === "ps"
              ? "PS"
              : "FA";
  return `[${label}] ${textNl}`;
}

export function t(locale: Locale, key: keyof typeof UI_NL): string {
  const nl = UI_NL[key] ?? key;
  return mockTranslateText(locale, nl);
}

export function translate(locale: Locale, nlText: string): string {
  return mockTranslateText(locale, nlText);
}

