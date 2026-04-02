export type MessageContext = {
  label?: string; // e.g. "Rekenen", "Stage", "Klas"
  when?: string; // ISO or human string
  studentName?: string;
};

export type ThreadMessage = {
  id: string;
  fromName: string;
  bodyNl: string;
  createdAt: string; // ISO
  context?: MessageContext;
};

export type MessageThread = {
  id: string;
  titleNl: string;
  participantsNl: string;
  lastActivityAt: string;
  messages: ThreadMessage[];
  isAnnouncement?: boolean;
  group?: boolean;
};

export const MOCK_THREADS: MessageThread[] = [
  {
    id: "thr-1",
    titleNl: "Dagelijkse update - Noah",
    participantsNl: "Mevr. De Smet ↔ Ouder",
    lastActivityAt: "2026-04-01T16:10:00.000Z",
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
];

