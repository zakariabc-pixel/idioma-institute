export const PIPELINE = [
  { key: "nouveau", label: "Nouveau" },
  { key: "contacte", label: "Contacté" },
  { key: "test_niveau", label: "Test de niveau" },
  { key: "cours_essai", label: "Cours d'essai" },
  { key: "proposition", label: "Proposition" },
  { key: "gagne", label: "Gagné" },
  { key: "perdu", label: "Perdu" },
] as const;

export type PipelineStep = (typeof PIPELINE)[number]["key"];
