export type MessageContext = {
  label?: string; // e.g. "Rekenen", "Stage", "Klas"
  when?: string; // ISO or human string
  studentName?: string;
};

/** Gestructureerde brief in bericht-detail (bron: oudercontact-brief, ODT) */
export type BriefBlock =
  | { type: "h2"; textNl: string }
  | { type: "p"; textNl: string }
  | { type: "facts"; items: { labelNl: string; valueNl: string }[] }
  | { type: "callout"; textNl: string }
  | { type: "signature"; linesNl: string[] }
  /** Standaard dichtgevouwen: extra blokken onder summary (bijv. papieren bijlage) */
  | { type: "details"; summaryNl: string; children: BriefBlock[] };

export type ThreadMessage = {
  id: string;
  fromName: string;
  bodyNl: string;
  createdAt: string; // ISO
  context?: MessageContext;
  /** Als gezet: volledige brief als compacte blokken; `bodyNl` mag leeg of enkel teaser zijn */
  briefBlocks?: BriefBlock[];
};

export type MessageThread = {
  id: string;
  titleNl: string;
  participantsNl: string;
  lastActivityAt: string;
  messages: ThreadMessage[];
  /** Korte teaser in lijst (i.p.v. laatste berichttekst), handig bij lange brieven */
  listSnippetNl?: string;
  isAnnouncement?: boolean;
  group?: boolean;
  visibleTo: Array<"parent" | "teacher" | "student">;
};

export const MOCK_THREADS: MessageThread[] = [
  {
    id: "thr-1",
    titleNl: "Dagelijkse update - Noah",
    participantsNl: "Mevr. De Smet ↔ Ouder",
    lastActivityAt: "2026-04-01T16:10:00.000Z",
    visibleTo: ["parent", "teacher"],
    messages: [
      {
        id: "m-1",
        fromName: "Mevr. De Smet",
        createdAt: "2026-04-01T15:40:00.000Z",
        bodyNl:
          "Noah werkte vandaag rustig door. Hij hielp ook een klasgenoot en bleef vriendelijk bij de kassa-oefening.",
        context: { label: "Winkel / logistiek", when: "Vandaag", studentName: "Noah" },
      },
      {
        id: "m-2",
        fromName: "Ouder",
        createdAt: "2026-04-01T16:10:00.000Z",
        bodyNl:
          "Dankjewel! We merken thuis ook dat hij meer wil helpen. Is er iets dat we kunnen oefenen?",
      },
    ],
  },
  {
    id: "thr-2",
    titleNl: "Mededeling: uitstap en lunch",
    participantsNl: "School → alle ouders",
    lastActivityAt: "2026-03-28T10:00:00.000Z",
    isAnnouncement: true,
    group: true,
    visibleTo: ["parent", "teacher"],
    messages: [
      {
        id: "m-3",
        fromName: "Schoolteam",
        createdAt: "2026-03-28T10:00:00.000Z",
        bodyNl:
          "Vrijdag is er een leeruitstap. Gelieve een lunchpakket en waterfles mee te geven. Vertrek om 09:00, terug om 15:30.",
        context: { label: "Leeruitstap", when: "Vrijdag" },
      },
    ],
  },
  {
    id: "thr-3",
    titleNl: "Workshop: omgaan met stress (inschrijven)",
    participantsNl: "Leerkracht → ouders",
    lastActivityAt: "2026-03-25T19:05:00.000Z",
    group: true,
    visibleTo: ["parent", "teacher"],
    messages: [
      {
        id: "m-4",
        fromName: "Dhr. Van den Broeck",
        createdAt: "2026-03-25T19:05:00.000Z",
        bodyNl:
          "Volgende week is er een ouderworkshop over stress en rustmomenten. Je kan inschrijven via de agenda.",
        context: { label: "Workshop", when: "Volgende week" },
      },
    ],
  },
  {
    id: "thr-oudercontact",
    titleNl: "Infomoment oudercontact (talenten & kieswijzer)",
    participantsNl: "IVIO Binnenhof Gent → alle ouders/opvoeders",
    lastActivityAt: "2026-05-06T09:30:00.000Z",
    listSnippetNl:
      "Uitnodiging infomoment: talenten, kieswijzer OV3 en werking van de school — open voor datum, tijd en praktisch.",
    isAnnouncement: true,
    group: true,
    visibleTo: ["parent", "teacher"],
    messages: [
      {
        id: "m-oudercontact-v3",
        fromName: "Schoolteam IVIO Binnenhof Gent",
        createdAt: "2026-05-06T09:30:00.000Z",
        bodyNl: "",
        context: { label: "Oudercontact", when: "Infomoment" },
        briefBlocks: [
          { type: "h2", textNl: "Uitnodiging infomoment" },
          {
            type: "p",
            textNl:
              "Beste ouder(s), opvoeder(s) of voogd(en), graag nodigen wij jullie uit voor een infomoment op onze school, IVIO Binnenhof Gent.",
          },
          {
            type: "p",
            textNl:
              "Tijdens dit moment zetten we de talenten van onze leerlingen in de kijker. We geven meer uitleg over het project “kieswijzer” binnen de richting OV3 en tonen hoe we samen werken aan de groei van elk kind, op maat van zijn of haar kunnen.",
          },
          {
            type: "p",
            textNl:
              "Daarnaast maken we jullie graag wegwijs in de werking van onze school, zodat er een duidelijk beeld ontstaat van de hulp en de kansen die we proberen te bieden.",
          },
          {
            type: "facts",
            items: [
              { labelNl: "Datum", valueNl: "Wordt nog bevestigd (volgt via agenda)." },
              { labelNl: "Uur", valueNl: "Wordt nog bevestigd." },
              { labelNl: "Locatie", valueNl: "IVIO Binnenhof, Gent" },
            ],
          },
          {
            type: "p",
            textNl:
              "Na deze uitleg is er ruimte om vragen te stellen en in gesprek te gaan met onze leerkrachten. We kijken uit naar jullie bezoek!",
          },
          {
            type: "callout",
            textNl:
              "Gelieve ons tijdig op de hoogte te brengen van jullie aanwezigheid (via de gekozen aanmeldweg van de school, bijvoorbeeld e-mail of formulier dat jullie ontvangen).",
          },
          {
            type: "signature",
            linesNl: [
              "Met vriendelijke groeten",
              "Het schoolteam IVIO Binnenhof Gent",
              "Contact: gebruik hier het officiële e-mail/formulier van jullie netwerk (in dit prototype nog niet gekoppeld).",
            ],
          },
          {
            type: "details",
            summaryNl: "Voorbereiding — invulreep van de papieren brief",
            children: [
              {
                type: "h2",
                textNl: "Bijlage uit de gedrukte uitnodiging",
              },
              {
                type: "p",
                textNl:
                  "Op papier vind je soms nog een klein invulgreep ter voorbereiding van het gesprek. Je hoeft dit niet hier te typen; dit is alleen als herinnering tijdens oudercontact.",
              },
              {
                type: "facts",
                items: [
                  {
                    labelNl: "Naam",
                    valueNl: "(invullen op papier of samen tijdens gesprek)",
                  },
                  {
                    labelNl: "Mijn talenten zijn…",
                    valueNl: "Ruimte om samen aan te vullen tijdens oudercontact.",
                  },
                  {
                    labelNl: "Slagzin (papieren versie)",
                    valueNl:
                      "\"Ik kan de wereld aan!\" — gebruik waar passend om het gesprek te openen.",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "thr-4",
    titleNl: "Feedback op je oefening - Noah",
    participantsNl: "Mevr. De Smet ↔ Leerling",
    lastActivityAt: "2026-04-02T14:10:00.000Z",
    visibleTo: ["student", "teacher"],
    messages: [
      {
        id: "m-5",
        fromName: "Mevr. De Smet",
        createdAt: "2026-04-02T14:05:00.000Z",
        bodyNl: "Sterk gewerkt vandaag. Je hield goed tempo en je werkte netjes af.",
        context: { label: "Klas", when: "Vandaag", studentName: "Noah" },
      },
      {
        id: "m-6",
        fromName: "Noah",
        createdAt: "2026-04-02T14:10:00.000Z",
        bodyNl: "Dankjewel, ik ga dit morgen opnieuw proberen.",
      },
    ],
  },
];

export function getThreadsForRole(role: "parent" | "teacher" | "student") {
  return MOCK_THREADS.filter((thread) => thread.visibleTo.includes(role));
}

