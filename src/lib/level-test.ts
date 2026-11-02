// Banque de questions du test de niveau (2 questions par niveau, A1 -> C1).
// À remplacer progressivement par les questions du programme Idioma.
export type Question = { q: string; options: string[]; answer: number };

export const questionBank: Record<"fr" | "en" | "es", Question[]> = {
  fr: [
    { q: "Je ___ étudiant.", options: ["es", "suis", "est", "sommes"], answer: 1 },
    { q: "Nous ___ à Casablanca.", options: ["habitons", "habitez", "habite", "habitent"], answer: 0 },
    { q: "Hier, j'___ au cinéma.", options: ["vais", "irai", "suis allé", "allais allé"], answer: 2 },
    { q: "Il y a ___ pommes sur la table.", options: ["du", "des", "de la", "un"], answer: 1 },
    { q: "Si j'avais le temps, je ___ plus.", options: ["lis", "lirai", "lirais", "ai lu"], answer: 2 },
    { q: "C'est le livre ___ je t'ai parlé.", options: ["que", "qui", "dont", "où"], answer: 2 },
    { q: "Il faut que tu ___ ce dossier.", options: ["finis", "finisses", "finiras", "finissais"], answer: 1 },
    { q: "___ la pluie, le match a eu lieu.", options: ["Malgré", "Bien que", "Puisque", "Grâce"], answer: 0 },
    { q: "Elle regrette qu'il ___ parti si tôt.", options: ["est", "soit", "était", "sera"], answer: 1 },
    { q: "« Avoir du pain sur la planche » signifie :", options: ["avoir faim", "avoir beaucoup de travail", "être boulanger", "être en retard"], answer: 1 },
  ],
  en: [
    { q: "She ___ a teacher.", options: ["are", "is", "am", "be"], answer: 1 },
    { q: "___ you like coffee?", options: ["Does", "Are", "Do", "Is"], answer: 2 },
    { q: "Yesterday I ___ to the market.", options: ["go", "went", "gone", "have gone"], answer: 1 },
    { q: "There isn't ___ milk left.", options: ["some", "many", "any", "few"], answer: 2 },
    { q: "I've lived here ___ 2019.", options: ["for", "since", "from", "during"], answer: 1 },
    { q: "If it rains, we ___ at home.", options: ["stay", "will stay", "would stay", "stayed"], answer: 1 },
    { q: "The report ___ by Friday.", options: ["must finish", "must be finished", "must finished", "must have finish"], answer: 1 },
    { q: "I wish I ___ harder at school.", options: ["studied", "had studied", "study", "would study"], answer: 1 },
    { q: "Hardly ___ arrived when the meeting started.", options: ["I had", "had I", "I have", "did I"], answer: 1 },
    { q: "To \"call it a day\" means to:", options: ["phone someone", "stop working", "plan the day", "name a date"], answer: 1 },
  ],
  es: [
    { q: "Yo ___ de Marruecos.", options: ["es", "soy", "estoy", "eres"], answer: 1 },
    { q: "¿Cómo te ___?", options: ["llamas", "llama", "llamo", "llaman"], answer: 0 },
    { q: "Ayer ___ al cine.", options: ["voy", "fui", "iba", "iré"], answer: 1 },
    { q: "Me ___ mucho los libros.", options: ["gusta", "gustan", "gusto", "gustas"], answer: 1 },
    { q: "Cuando era niño, ___ en el campo.", options: ["viví", "vivía", "viviré", "he vivido"], answer: 1 },
    { q: "Espero que ___ buen tiempo mañana.", options: ["hace", "hará", "haga", "hacía"], answer: 2 },
    { q: "Si tuviera dinero, ___ un coche.", options: ["compro", "compraré", "compraría", "compré"], answer: 2 },
    { q: "No creo que ___ razón.", options: ["tienes", "tengas", "tendrás", "tenías"], answer: 1 },
    { q: "Si me lo ___ dicho, habría venido.", options: ["habías", "hubieras", "has", "habrías"], answer: 1 },
    { q: "\"Estar en las nubes\" significa:", options: ["estar distraído", "viajar en avión", "estar triste", "tener sueño"], answer: 0 },
  ],
};

const levels = ["A1", "A2", "B1", "B2", "C1"] as const;

/** 0-1 bonnes réponses -> A1, 2-3 -> A2, 4-5 -> B1, 6-7 -> B2, 8-10 -> C1 */
export function scoreToLevel(correct: number) {
  return levels[Math.min(levels.length - 1, Math.floor(correct / 2))];
}
