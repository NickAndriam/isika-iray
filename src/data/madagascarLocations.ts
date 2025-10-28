export interface MadagascarLocation {
  province: string;
  region: string;
  district: string;
}

export const madagascarLocations = {
  Antananarivo: {
    regions: {
      Analamanga: [
        "Antananarivo",
        "Ambohidratrimo",
        "Anjozorobe",
        "Manjakandriana",
      ],
      Vakinankaratra: ["Antsirabe", "Betafo", "Ambatolampy", "Faratsiho"],
      Bongolava: ["Tsiroanomandidy", "Fenoarivo-Be"],
    },
  },
  Fianarantsoa: {
    regions: {
      "Haute Matsiatra": [
        "Fianarantsoa",
        "Ambalavao",
        "Ambohimahasoa",
        "Ikalamavony",
      ],
      Ihorombe: ["Ihosy", "Iakora"],
      "Matsiatra Ambony": ["Ambalavao", "Fianarantsoa"],
      Vatovavy: ["Mananjary", "Nosy Varika"],
      Fitovinany: ["Manakara", "Vohipeno", "Ikongo"],
    },
  },
  Toamasina: {
    regions: {
      "Alaotra-Mangoro": ["Ambatondrazaka", "Amparafaravola", "Moramanga"],
      Analanjirofo: ["Fénérive Est", "Soanierana Ivongo", "Maroantsetra"],
      Atsinanana: ["Toamasina", "Vatomandry", "Mahanoro"],
    },
  },
  Mahajanga: {
    regions: {
      Boeny: ["Mahajanga", "Marovoay", "Ambato-Boeni"],
      Betsiboka: ["Maevatanana", "Kandreho"],
      Sofia: ["Antsohihy", "Bealanana", "Befandriana-Nord"],
    },
  },
  Toliara: {
    regions: {
      "Atsimo-Andrefana": ["Toliara", "Sakaraha", "Ampanihy", "Morombe"],
      Androy: ["Ambovombe", "Beloha"],
      Anosy: ["Fort-Dauphin (Tôlanaro)", "Amboasary", "Betroka"],
      Menabe: ["Morondava", "Belo-sur-Tsiribihina"],
    },
  },
  Antsiranana: {
    regions: {
      Diana: ["Antsiranana", "Ambilobe", "Nosy Be"],
      Sava: ["Sambava", "Antalaha", "Andapa", "Vohemar"],
    },
  },
};

export const provinces = Object.keys(madagascarLocations);

export const getRegionsByProvince = (province: string): string[] => {
  return Object.keys(
    madagascarLocations[province as keyof typeof madagascarLocations]
      ?.regions || {}
  );
};

export const getDistrictsByRegion = (
  province: string,
  region: string
): string[] => {
  return (
    madagascarLocations[province as keyof typeof madagascarLocations]?.regions[
      region as keyof (typeof madagascarLocations)[typeof province]["regions"]
    ] || []
  );
};
