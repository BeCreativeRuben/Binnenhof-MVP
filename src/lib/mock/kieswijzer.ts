export type KieswijzerClusterId = "winkel_logistiek" | "zorg_huishoud" | "horeca_hotel";

export type KieswijzerCluster = {
  id: KieswijzerClusterId;
  titleNl: string;
  subtitleNl: string;
};

export const CLUSTERS: KieswijzerCluster[] = [
  {
    id: "winkel_logistiek",
    titleNl: "Winkel & logistiek",
    subtitleNl: "Winkelmedewerker, logistiek, organisatie en taken met structuur.",
  },
  {
    id: "zorg_huishoud",
    titleNl: "Zorg & huishoud",
    subtitleNl: "Helpen, zorgen, proper en netjes werken in een team.",
  },
  {
    id: "horeca_hotel",
    titleNl: "Horeca & hotel",
    subtitleNl: "Bedienen, organiseren, hygiënisch werken en klantencontact.",
  },
];

export type KieswijzerItem = {
  id: string;
  labelNl: string;
  cluster: KieswijzerClusterId;
  kind: "techniek" | "talent";
};

// Bron: KIES WIJZER (vereenvoudigd voor MVP)
export const ITEMS: KieswijzerItem[] = [
  // Winkel / logistiek - technieken
  { id: "t-weg-wijzen", labelNl: "Mensen de weg wijzen", cluster: "winkel_logistiek", kind: "techniek" },
  { id: "t-klanten-helpen", labelNl: "Klanten helpen", cluster: "winkel_logistiek", kind: "techniek" },
  { id: "t-laden-lossen", labelNl: "Laden en lossen", cluster: "winkel_logistiek", kind: "techniek" },
  { id: "t-kassa", labelNl: "Kassawerk", cluster: "winkel_logistiek", kind: "techniek" },
  { id: "t-rekken", labelNl: "Rekken aanvullen", cluster: "winkel_logistiek", kind: "techniek" },
  { id: "t-orders", labelNl: "Orders verzamelen", cluster: "winkel_logistiek", kind: "techniek" },
  { id: "t-inpakken", labelNl: "Inpakken", cluster: "winkel_logistiek", kind: "techniek" },
  // Winkel / logistiek - talenten
  { id: "ta-samenwerken", labelNl: "Samenwerken", cluster: "winkel_logistiek", kind: "talent" },
  { id: "ta-uitleggen", labelNl: "Uitleggen", cluster: "winkel_logistiek", kind: "talent" },
  { id: "ta-rekenen", labelNl: "Rekenen", cluster: "winkel_logistiek", kind: "talent" },
  { id: "ta-computer", labelNl: "Werken met de computer", cluster: "winkel_logistiek", kind: "talent" },
  { id: "ta-nauwkeurig", labelNl: "Nauwkeurig zijn", cluster: "winkel_logistiek", kind: "talent" },
  { id: "ta-vriendelijk", labelNl: "Vriendelijk zijn", cluster: "winkel_logistiek", kind: "talent" },

  // Zorg / huishoud - technieken
  { id: "t-ramen", labelNl: "Ramen wassen", cluster: "zorg_huishoud", kind: "techniek" },
  { id: "t-stofzuigen", labelNl: "Stofzuigen", cluster: "zorg_huishoud", kind: "techniek" },
  { id: "t-strijken", labelNl: "Strijken", cluster: "zorg_huishoud", kind: "techniek" },
  { id: "t-afwassen", labelNl: "Afwassen", cluster: "zorg_huishoud", kind: "techniek" },
  { id: "t-bedden", labelNl: "Bedden opmaken", cluster: "zorg_huishoud", kind: "techniek" },
  { id: "t-maaltijden", labelNl: "Maaltijden uitdelen", cluster: "zorg_huishoud", kind: "techniek" },
  // Zorg / huishoud - talenten
  { id: "ta-voorzichtig", labelNl: "Voorzichtig zijn", cluster: "zorg_huishoud", kind: "talent" },
  { id: "ta-betrouwbaar", labelNl: "Betrouwbaar zijn", cluster: "zorg_huishoud", kind: "talent" },
  { id: "ta-luisteren", labelNl: "Luisteren", cluster: "zorg_huishoud", kind: "talent" },
  { id: "ta-helpen", labelNl: "Helpen van mensen", cluster: "zorg_huishoud", kind: "talent" },
  { id: "ta-netjes", labelNl: "Netjes zijn", cluster: "zorg_huishoud", kind: "talent" },
  { id: "ta-volhouden", labelNl: "Volhouden", cluster: "zorg_huishoud", kind: "talent" },

  // Horeca / hotel - technieken
  { id: "t-bedienen", labelNl: "Klanten bedienen", cluster: "horeca_hotel", kind: "techniek" },
  { id: "t-ontbijt", labelNl: "Ontbijt klaarzetten", cluster: "horeca_hotel", kind: "techniek" },
  { id: "t-groenten", labelNl: "Groenten/fruit snijden", cluster: "horeca_hotel", kind: "techniek" },
  { id: "t-koffie", labelNl: "Koffie ronddelen", cluster: "horeca_hotel", kind: "techniek" },
  { id: "t-linnen", labelNl: "Linnen opbergen", cluster: "horeca_hotel", kind: "techniek" },
  // Horeca / hotel - talenten
  { id: "ta-organiseren", labelNl: "Organiseren", cluster: "horeca_hotel", kind: "talent" },
  { id: "ta-hygiene", labelNl: "Hygiënisch werken", cluster: "horeca_hotel", kind: "talent" },
  { id: "ta-plannen", labelNl: "Plannen werk", cluster: "horeca_hotel", kind: "talent" },
  { id: "ta-veilig", labelNl: "Veilig werken", cluster: "horeca_hotel", kind: "talent" },
  { id: "ta-alleen", labelNl: "Alleen werken", cluster: "horeca_hotel", kind: "talent" },
];

export function scoreClusters(selectedItemIds: string[]) {
  const counts: Record<KieswijzerClusterId, number> = {
    winkel_logistiek: 0,
    zorg_huishoud: 0,
    horeca_hotel: 0,
  };

  const byId = new Map(ITEMS.map((i) => [i.id, i]));
  for (const id of selectedItemIds) {
    const item = byId.get(id);
    if (!item) continue;
    counts[item.cluster] += 1;
  }

  const results = CLUSTERS.map((c) => ({
    cluster: c,
    score: counts[c.id],
  })).sort((a, b) => b.score - a.score);

  return results;
}

