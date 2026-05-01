/**
 * Reflectievragen uit woordflash-materiaal (PDF p. 6–10 — zelfinzicht ja/nee).
 * Geen “juiste” antwoorden in de app: beide tellen voor de serie.
 */

export type ReflectieVraag = {
  id: string;
  textNl: string;
};

export const REFLECTIE_VRAGEN: ReflectieVraag[] = [
  { id: "rf-001", textNl: "Kan ik typen?" },
  {
    id: "rf-002",
    textNl: "Kan ik mij concentreren op een beeldscherm?",
  },
  { id: "rf-003", textNl: "Kan ik lang stilzitten?" },
  { id: "rf-004", textNl: "Kan ik voorzichtig zijn?" },
  {
    id: "rf-005",
    textNl: "Kan ik herhalingswerk doen?",
  },
  { id: "rf-006", textNl: "Durf ik mensen aan te spreken?" },
  {
    id: "rf-007",
    textNl: "Durf ik met iemand anders zijn centjes om te gaan?",
  },
  { id: "rf-008", textNl: "Ben ik goed in wiskunde?" },
  {
    id: "rf-009",
    textNl: "Kan ik een boodschappenlijstje volgen?",
  },
  {
    id: "rf-010",
    textNl: "Durf ik met een transpallet rijden?",
  },
  { id: "rf-011", textNl: "Ben ik ordelijk?" },
  { id: "rf-012", textNl: "Kan ik voorzichtig werken?" },
  {
    id: "rf-013",
    textNl: "Ben ik graag creatief bezig?",
  },
  { id: "rf-014", textNl: "Durf ik met water te werken?" },
  { id: "rf-015", textNl: "Ben ik voorzichtig?" },
  { id: "rf-016", textNl: "Durf ik afval op te ruimen?" },
  { id: "rf-017", textNl: "Hou ik van structuur?" },
  {
    id: "rf-018",
    textNl: "Durf ik andere mensen aan te spreken?",
  },
  { id: "rf-019", textNl: "Durf ik met eten te werken?" },
  { id: "rf-020", textNl: "Ben ik proper?" },
  {
    id: "rf-021",
    textNl: "Durf ik mensen te helpen?",
  },
  { id: "rf-022", textNl: "Kan ik vroeg opstaan?" },
  {
    id: "rf-023",
    textNl: "Ben ik vriendelijk?",
  },
  { id: "rf-024", textNl: "Durf ik met messen te werken?" },
  {
    id: "rf-025",
    textNl: "Durf ik met warme vloeistof rond te lopen?",
  },
  { id: "rf-026", textNl: "Ruim ik ook op?" },
  { id: "rf-027", textNl: "Babbel ik graag?" },
  {
    id: "rf-028",
    textNl: "Durf ik te praten tegen mensen die ik niet ken?",
  },
  {
    id: "rf-029",
    textNl: "Kan ik iets duidelijk maken aan iemand anders?",
  },
  {
    id: "rf-030",
    textNl:
      "Denk ik altijd aan mijn eigen veiligheid en die van de mensen rondom mij vooraleer ik iets doe?",
  },
];

export function findReflectQuestion(id: string) {
  return REFLECTIE_VRAGEN.find((q) => q.id === id);
}
