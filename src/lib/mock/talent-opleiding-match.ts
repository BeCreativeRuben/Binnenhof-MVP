import { ITEMS, type KieswijzerClusterId } from "@/lib/mock/kieswijzer";

/**
 * Opleidingen zoals op “Talenten & technieken koppelen aan opleiding”.
 * Elk item uit de kieswijzer hoort bij exact één cluster; die cluster hangen we
 * hier aan deze drie opleidingsroutes.
 */
export const OPLEIDING_OPTIES = [
  {
    cluster: "winkel_logistiek" as const,
    labelNl: "Organisatie en Logistiek",
  },
  {
    cluster: "zorg_huishoud" as const,
    labelNl: "Logistiek Onderhoud",
  },
  {
    cluster: "horeca_hotel" as const,
    labelNl: "Horeca",
  },
];

export type OpleidingOptieCluster = (typeof OPLEIDING_OPTIES)[number]["cluster"];

export function getItemCorrectCluster(itemId: string): KieswijzerClusterId | null {
  return ITEMS.find((i) => i.id === itemId)?.cluster ?? null;
}

export function itemLabelNl(itemId: string): string {
  return ITEMS.find((i) => i.id === itemId)?.labelNl ?? itemId;
}

export function itemKindNl(itemId: string): "techniek" | "talent" | null {
  return ITEMS.find((i) => i.id === itemId)?.kind ?? null;
}
