export type AgendaItem = {
  id: string;
  titleNl: string;
  startsAt: string; // ISO
  endsAt?: string; // ISO
  locationNl?: string;
  descriptionNl?: string;
  type: "school" | "workshop" | "student";
  /** Present when loaded from teacher-created agenda API rows */
  teacherCreated?: boolean;
};

export const MOCK_AGENDA: AgendaItem[] = [
  {
    id: "a-1",
    titleNl: "Workshop voor ouders: stress & rustmomenten",
    startsAt: "2026-04-08T18:30:00.000Z",
    endsAt: "2026-04-08T19:30:00.000Z",
    locationNl: "Campus Peperstraat",
    descriptionNl:
      "Praktische tips, korte oefeningen en ruimte voor vragen. Inschrijven is optioneel.",
    type: "workshop",
  },
  {
    id: "a-2",
    titleNl: "Leeruitstap",
    startsAt: "2026-04-04T09:00:00.000Z",
    endsAt: "2026-04-04T15:30:00.000Z",
    descriptionNl: "Lunchpakket + waterfles meegeven.",
    type: "school",
  },
  {
    id: "a-3",
    titleNl: "Kieswijzer moment (leerling)",
    startsAt: "2026-04-02T13:30:00.000Z",
    endsAt: "2026-04-02T14:15:00.000Z",
    descriptionNl: "Korte quiz + bespreking van talenten.",
    type: "student",
  },
];

