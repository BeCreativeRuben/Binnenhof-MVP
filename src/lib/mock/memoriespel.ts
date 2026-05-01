import { WORD_EXPLANATION_FLASHCARDS } from "@/lib/mock/flashcards-woordverklaring";

export type MemoriespelTile = {
  pairId: string;
  /** Tekst op de kaart: begrip of ingekorte voorbeeldzin */
  face: string;
};

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const MAX_HINT = 110;

/**
 * Memoriespel: per begrip twee kaarten — het woord en een korte situatie.
 * (PDF “Memoriespel” is hier visueel ingevoerd; inhoud sluit aan bij woordverklaring-materiaal.)
 */
export function buildMemoriespelDeck(pairCount = 8): MemoriespelTile[] {
  const n = Math.min(pairCount, WORD_EXPLANATION_FLASHCARDS.length);
  const picks = shuffle([...WORD_EXPLANATION_FLASHCARDS]).slice(0, n);
  const tiles: MemoriespelTile[] = [];
  for (const c of picks) {
    tiles.push({ pairId: c.id, face: c.term });
    const s = c.scenario.trim();
    const hint = s.length > MAX_HINT ? `${s.slice(0, MAX_HINT - 1)}…` : s;
    tiles.push({ pairId: c.id, face: hint });
  }
  return shuffle(tiles);
}
