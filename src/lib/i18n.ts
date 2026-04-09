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

const UI_EN: Dictionary = {
  "app.name": "Binnenhof Connect",
  "login.title": "Sign in (prototype)",
  "login.subtitle": "Sign in with your account. Missing translations are logged.",
  "login.role": "Role",
  "login.language": "Language",
  "login.user": "Account",
  "login.continue": "Continue",
  "nav.dashboard": "Home",
  "nav.messages": "Messages",
  "nav.agenda": "Agenda",
  "nav.workshops": "Workshops",
  "nav.kieswijzer": "Choice guide",
  "nav.assignments": "Assignments",
  "common.back": "Back",
  "common.logout": "Sign out",
  "common.optional": "Optional",
  "common.search": "Search",
  "dashboard.welcome": "Welcome",
  "dashboard.quickActions": "Quick actions",
  "dashboard.latest": "Latest updates",
  "messages.title": "Messages",
  "messages.new": "New message",
  "messages.context": "Context",
  "messages.reply": "Reply",
  "agenda.title": "Agenda",
  "agenda.upcoming": "Upcoming",
  "workshops.title": "Workshops",
  "workshops.emailPreview": "Email preview",
  "kieswijzer.title": "Choice guide",
  "kieswijzer.subtitle": "Select what fits. You get a ranked list of directions.",
  "kieswijzer.start": "Start quiz",
  "kieswijzer.results": "Results",
  "student.assignments.title": "Assignments",
  "student.assignments.subtitle": "Short games and tasks. Results are stored per account.",
  "teacher.title": "Teacher",
  "parent.title": "Parent/Guardian",
  "student.title": "Student",
};

const DICTS: Record<Locale, Dictionary> = {
  nl: UI_NL,
  en: UI_EN,
  tr: {},
  bg: {},
  ps: {},
  fa: {},
  sk: {},
};

const DYNAMIC_EN: Record<string, string> = {
  "Lees je berichten": "Read your messages",
  "Bekijk je afspraken": "View your appointments",
  "Doe mee met workshops": "Join workshops",
  "Krijg hulp bij kiezen": "Get help choosing",
  "Speel en scoor punten": "Play and score points",
  "Bekijk alle berichten": "View all messages",
  "Bericht opmaken (demo)": "Compose message (demo)",
  "Mockup voor groepsbericht of bericht naar specifieke ouders/voogden.":
    "Mockup for group message or message to specific parents/guardians.",
  Groepsbericht: "Group message",
  "Specifieke ouder(s)": "Specific parent(s)",
  "Context (optioneel): bv. Rekenen, Stage, Workshop":
    "Context (optional): e.g. Math, Internship, Workshop",
  "Schrijf je bericht...": "Write your message...",
  "Verzenden (mock)": "Send (mock)",
  Preview: "Preview",
  "geen ontvangers": "no recipients",
  "Nog geen bericht.": "No message yet.",
  "Auto-vertaling simulatie": "Auto-translation simulation",
  "Bericht opgeslagen als demo-item (geen echte verzending in MVP).":
    "Message saved as demo item (no real sending in MVP).",
  Uitnodiging: "Invitation",
  workshop: "workshop",
  "Beste ouder/voogd": "Dear parent/guardian",
  "Je bent welkom op onze workshop.": "You are welcome at our workshop.",
  Wanneer: "When",
  Waar: "Where",
  "IVIO Binnenhof": "IVIO Binnenhof",
  "Inschrijven is optioneel.": "Registration is optional.",
  "Met vriendelijke groeten": "Kind regards",
  "voor ouders wordt dit de vaste taal.": "for parents this becomes the default language.",
  "Log in met accountgegevens uit de database.": "Log in with account details from the database.",
  Gebruikersnaam: "Username",
  Wachtwoord: "Password",
  "Kon rol niet laden.": "Could not load role.",
  "Bezig...": "Loading...",
  "Setup mislukt.": "Setup failed.",
  "Setup klaar. Demo-wachtwoord voor alle accounts: Welkom123!":
    "Setup complete. Demo password for all accounts: Welkom123!",
  "Database setup (demo accounts)": "Database setup (demo accounts)",
  "Per klas leaderboard (initialen)": "Per-class leaderboard (initials)",
  Vernieuwen: "Refresh",
  "Stop & score opslaan": "Stop & save score",
  "Start spel": "Start game",
  "Nog geen scores.": "No scores yet.",
  fouten: "mistakes",
  "Gegevens laden/verversen": "Load/refresh data",
  "Kind selecteren": "Select child",
  "Leerkracht modus": "Teacher mode",
  Invullen: "Fill in",
  Resultaten: "Results",
  "Leerling selecteren": "Select student",
  "Overzicht leerkracht": "Teacher overview",
  "Bekijk per partij de input en vergelijk gemiddelde verschillen.":
    "View each party's input and compare averages and differences.",
  Vergelijking: "Comparison",
  "Ouder/Voogd": "Parent/Guardian",
  Leerling: "Student",
  Leerkracht: "Teacher",
  Commentaar: "Comment",
  Ingevuld: "Submitted",
  Ja: "Yes",
  Nee: "No",
  "Export PDF (NL)": "Export PDF (NL)",
  Technieken: "Techniques",
  "Kies wat je graag doet.": "Choose what you like doing.",
  Talenten: "Talents",
  "Kies wat je goed kan.": "Choose what you are good at.",
  Reset: "Reset",
  "Optioneel commentaar": "Optional comment",
  "Opslaan mislukt": "Saving failed",
  "Definitief indienen": "Final submit",
  "Voor deze rol is de kieswijzer al ingediend. Aanpassen is niet mogelijk.":
    "The choice guide has already been submitted for this role. Editing is not possible.",
  "Score op basis van je keuzes. Resultaat wordt pas na definitieve submit getoond.":
    "Score based on your selections. The result is only shown after final submission.",
  "1-op-1, groepsberichten en mededelingen (mock data).":
    "1-on-1 messages, group messages and announcements (mock data).",
  "(MVP: geen echte communicatie)": "(MVP: no real communication)",
  School: "School",
  "Overzicht + e-mail preview (prototype).": "Overview + email preview (prototype).",
  "Automatisch vertaald voor deze taal (MVP zonder externe service).":
    "Automatically translated for this language (MVP without external service).",
  Aan: "To",
  Onderwerp: "Subject",
  Bericht: "Message",
  "Uitnodiging: workshop": "Invitation: workshop",
  "Beste ouder/voogd,\n\n...": "Dear parent/guardian,\n\n...",
  "Je bent niet ingelogd. Ga naar login om een rol te kiezen.":
    "You are not signed in. Go to login to choose a role.",
  "Korte spelletjes en taken. Je resultaten worden bewaard in dit prototype (op dit toestel).":
    "Short games and tasks. Your results are saved in this prototype (on this device).",
  "Klik start en stop wanneer je klaar bent. Snelste tijd wint.":
    "Click start and stop when you are done. Fastest time wins.",
  "Klik start en stop wanneer je klaar bent. Minste fouten wint bij gelijke tijd.":
    "Click start and stop when you are done. Fewest mistakes win on equal time.",
  "Kies een rol en taal. Dit is een demo-login met mock data.":
    "Choose a role and language. This is a demo login with mock data.",
  "Kies wat bij jou past. Je krijgt een ranglijst met mogelijke richtingen.":
    "Choose what fits you. You get a ranked list of possible directions.",
  "Winkel & logistiek": "Retail & logistics",
  "Winkelmedewerker, logistiek, organisatie en taken met structuur.":
    "Store work, logistics, organization and structured tasks.",
  "Zorg & huishoud": "Care & household",
  "Helpen, zorgen, proper en netjes werken in een team.":
    "Helping, caring, and working neatly in a team.",
  "Horeca & hotel": "Hospitality & hotel",
  "Bedienen, organiseren, hygiënisch werken en klantencontact.":
    "Serving, organizing, hygienic work and customer contact.",
  "Mensen de weg wijzen": "Guide people",
  "Klanten helpen": "Help customers",
  "Laden en lossen": "Loading and unloading",
  Kassawerk: "Cash register work",
  "Rekken aanvullen": "Restock shelves",
  "Orders verzamelen": "Collect orders",
  Inpakken: "Packing",
  Samenwerken: "Teamwork",
  Uitleggen: "Explaining",
  Rekenen: "Calculating",
  "Werken met de computer": "Working with a computer",
  "Nauwkeurig zijn": "Being accurate",
  "Vriendelijk zijn": "Being friendly",
  "Ramen wassen": "Washing windows",
  Stofzuigen: "Vacuuming",
  Strijken: "Ironing",
  Afwassen: "Doing dishes",
  "Bedden opmaken": "Making beds",
  "Maaltijden uitdelen": "Serving meals",
  "Voorzichtig zijn": "Being careful",
  "Betrouwbaar zijn": "Being reliable",
  Luisteren: "Listening",
  "Helpen van mensen": "Helping people",
  "Netjes zijn": "Being tidy",
  Volhouden: "Perseverance",
  "Klanten bedienen": "Serving customers",
  "Ontbijt klaarzetten": "Preparing breakfast",
  "Groenten/fruit snijden": "Cutting vegetables/fruit",
  "Koffie ronddelen": "Serving coffee",
  "Linnen opbergen": "Storing linen",
  Organiseren: "Organizing",
  "Hygiënisch werken": "Working hygienically",
  "Plannen werk": "Work planning",
  "Veilig werken": "Working safely",
  "Alleen werken": "Working alone",
  "Dagelijkse update - Noah": "Daily update - Noah",
  "Mevr. De Smet ↔ Ouder": "Ms. De Smet ↔ Parent",
  "Noah werkte vandaag rustig door. Hij hielp ook een klasgenoot en bleef vriendelijk bij de kassa-oefening.":
    "Noah worked calmly today. He also helped a classmate and stayed friendly during the cashier exercise.",
  "Winkel / logistiek": "Retail / logistics",
  Vandaag: "Today",
  Ouder: "Parent",
  "Dankjewel! We merken thuis ook dat hij meer wil helpen. Is er iets dat we kunnen oefenen?":
    "Thank you! We also notice at home that he wants to help more. Is there something we can practice?",
  "Mededeling: uitstap en lunch": "Announcement: trip and lunch",
  "School → alle ouders": "School -> all parents",
  Schoolteam: "School team",
  "Vrijdag is er een leeruitstap. Gelieve een lunchpakket en waterfles mee te geven. Vertrek om 09:00, terug om 15:30.":
    "There is a school trip on Friday. Please provide a packed lunch and water bottle. Departure at 09:00, return at 15:30.",
  Leeruitstap: "School trip",
  Vrijdag: "Friday",
  "Workshop: omgaan met stress (inschrijven)":
    "Workshop: dealing with stress (registration)",
  "Leerkracht → ouders": "Teacher -> parents",
  "Dhr. Van den Broeck": "Mr. Van den Broeck",
  "Volgende week is er een ouderworkshop over stress en rustmomenten. Je kan inschrijven via de agenda.":
    "Next week there is a parent workshop about stress and calm moments. You can register through the agenda.",
  Workshop: "Workshop",
  "Volgende week": "Next week",
  "Workshop voor ouders: stress & rustmomenten":
    "Workshop for parents: stress & calm moments",
  "Campus Peperstraat": "Peperstraat Campus",
  "Praktische tips, korte oefeningen en ruimte voor vragen. Inschrijven is optioneel.":
    "Practical tips, short exercises and room for questions. Registration is optional.",
  "Lunchpakket + waterfles meegeven.": "Bring a packed lunch + water bottle.",
  "Kieswijzer moment (leerling)": "Choice guide session (student)",
  "Korte quiz + bespreking van talenten.": "Short quiz + discussion of talents.",
};

function reportMissing(locale: Locale, key: string, fallback: string) {
  if (locale === "nl") return;
  if (typeof window !== "undefined") {
    const storageKey = "bh_missing_translations_v1";
    const raw = window.localStorage.getItem(storageKey);
    const current = raw ? (JSON.parse(raw) as string[]) : [];
    const line = `${locale}:${key}`;
    if (!current.includes(line)) {
      const next = [...current, line];
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      console.warn(`[i18n][missing] ${line}`, { fallback });
    }
  } else {
    console.warn(`[i18n][missing] ${locale}:${key}`);
  }
}

export function t(locale: Locale, key: keyof typeof UI_NL): string {
  const nl = UI_NL[key] ?? key;
  const dict = DICTS[locale] ?? UI_NL;
  const translated = dict[key];
  if (!translated) {
    reportMissing(locale, key, nl);
    return nl;
  }
  return translated;
}

export function translate(locale: Locale, nlText: string): string {
  if (locale === "en") {
    const found = DYNAMIC_EN[nlText];
    if (found) return found;
  }
  if (locale !== "nl") {
    reportMissing(locale, `dynamic:${nlText}`, nlText);
  }
  return nlText;
}

