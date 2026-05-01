/**
 * Bron: “flashcards woordverklaring versie3” — korte scenario’s gekoppeld aan begrippen.
 * Gebruikt in het studentenspel “Woordflash”.
 */
export type WordExplanationCard = {
  id: string;
  /** Tekst op de voorkant van de kaart */
  scenario: string;
  /** Het juiste kernbegrip (meerkeuze-antwoord) */
  term: string;
  /** Uitleg zoals in het lesmateriaal */
  definition: string;
};

export const WORD_EXPLANATION_FLASHCARDS: WordExplanationCard[] = [
  {
    id: "we-1",
    scenario:
      "Je speelt in de pauze met verschillende klasgenoten en niet altijd met dezelfde persoon.",
    term: "Contact met anderen",
    definition:
      "Het betekent dat je contact met anderen belangrijk en leuk vindt.",
  },
  {
    id: "we-2",
    scenario:
      'Durf ik mensen aan te spreken? Durf ik mensen te helpen bij wat ze aan het doen zijn, of wat ze nodig hebben? Je durft uit jezelf bijvoorbeeld “hallo” te zeggen.',
    term: "Open voor nieuwe contacten",
    definition:
      "Het betekent dat je open staat voor nieuwe contacten en graag nieuwe mensen leert kennen.",
  },
  {
    id: "we-3",
    scenario:
      "Je bent creatief en gebruikt allerlei materialen om nieuwe dingen op te bouwen. Je durft je handen vuil te maken.",
    term: "Creatief bouwen",
    definition:
      "Je gebruikt materialen om iets nieuws te maken en schuwt niet om praktisch bezig te zijn.",
  },
  {
    id: "we-4",
    scenario:
      'Je zegt “alsjeblieft” en “dank u wel”, en je helpt soms zonder dat iemand het vraagt.',
    term: "Vriendelijk zijn",
    definition:
      "Vriendelijk zijn betekent dat je goed bent voor andere mensen en respectvol communiceert.",
  },
  {
    id: "we-5",
    scenario:
      "De leerkracht geeft uitleg en jij let goed op zodat je het begrijpt en kan volgen.",
    term: "Luisteren",
    definition:
      "Luisteren betekent dat je aandacht geeft aan anderen zodat je hen goed begrijpt en verstaat wat er wordt verteld.",
  },
  {
    id: "we-6",
    scenario:
      "Je maakt samen een opdracht in de klas. Iedereen doet een klein stukje van het werk.",
    term: "Samenwerken",
    definition:
      "Samenwerken betekent dat je niet alleen werkt, maar samen met anderen een doel bereikt.",
  },
  {
    id: "we-7",
    scenario:
      "Je kleurt netjes binnen de lijntjes of je schrijft een opdracht zonder slordige fouten.",
    term: "Nauwkeurig werken",
    definition:
      "Nauwkeurig werken betekent dat je je best doet om je werk zo goed en volledig mogelijk te maken.",
  },
  {
    id: "we-8",
    scenario:
      "Je legt dingen ordelijk bijeen: volgens soort, kleur of vorm. Alles netjes op zijn plaats.",
    term: "Ordelijk houden",
    definition:
      "Het betekent dat je goed bent in alles proper en ordelijk te houden.",
  },
  {
    id: "we-9",
    scenario:
      "Je kijkt of alle materialen die je nodig hebt om te werken aanwezig zijn.",
    term: "Controleren",
    definition:
      "Controleren betekent dat je nakijkt of iets juist, volledig of in orde is.",
  },
  {
    id: "we-10",
    scenario:
      "Je stapelt dozen zorgvuldig of haalt ze weer voorzichtig uit een laadruimte.",
    term: "Laden en lossen",
    definition:
      "Laden en lossen betekent dat je op een voorzichtige manier spullen ergens kan inzetten of uithalen.",
  },
  {
    id: "we-11",
    scenario:
      "Je leest een ingrediëntenlijst en volgt daarna stap voor stap wat je moet doen.",
    term: "Instructies volgen",
    definition:
      "Het betekent dat je stap voor stap leest wat je moet doen om daarna iets klaar te maken.",
  },
  {
    id: "we-12",
    scenario:
      "Je bekijkt eerst welke stappen je nodig hebt voor je een rekensom oplost of iets uitvoert.",
    term: "Nadenken",
    definition:
      "Nadenken betekent dat je eerst in jezelf de situatie of oefening overloopt voordat je iets zegt of doet.",
  },
  {
    id: "we-13",
    scenario:
      "Je plant een taak eerst in je agenda voordat je ze gaat uitvoeren, zodat je structuur behoudt.",
    term: "Plannen en organiseren",
    definition:
      "Je vult vooraf je uren of dagen met wat er moet gebeuren en voert het later uit zonder veel tijd te verliezen.",
  },
  {
    id: "we-14",
    scenario:
      "Je leest een tekst en kan daarna eigen woorden gebruiken om uit te leggen wat je gelezen hebt.",
    term: "Begrijpen wat je leest",
    definition:
      "Het betekent dat je woorden, zinnen of informatie kan begrijpen en kan verwerken.",
  },
  {
    id: "we-15",
    scenario:
      "Je kan je naam schrijven of een korte bestelling nauwkeurig noteren.",
    term: "Schrijven en noteren",
    definition:
      "Je kan woorden en informatie op papier zetten of intypen op gsm of computer.",
  },
  {
    id: "we-16",
    scenario:
      "Je laat iemand stap voor stap zien hoe je een doos dichtmaakt — jij kan het goed en leert het over.",
    term: "Voordoen",
    definition:
      "Iets voordonen wil zeggen dat je iets wat jij goed kan, leert aan iemand anders.",
  },
  {
    id: "we-17",
    scenario:
      "Je hebt niet altijd iemand nodig om je werk gedaan te krijgen; je bent zelf aan de slag.",
    term: "Alleen werken",
    definition:
      "Alleen werken betekent dat je zelfstandig een opdracht kan uitvoeren zonder hulp.",
  },
  {
    id: "we-18",
    scenario:
      "Je kan blijven werken tot een taak af is — ook als het even moeilijk is of lang duurt. Je bent niet snel afgeleid.",
    term: "Volharding",
    definition:
      "Het betekent dat je blijft doorgaan, ook als iets moeilijk is of lang duurt. Je geeft niet snel op.",
  },
];
