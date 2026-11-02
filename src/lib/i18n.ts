export const locales = ["fr", "en", "es"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

const fr = {
  nav: { home: "Accueil", courses: "Nos cours", test: "Test de niveau", contact: "Inscription" },
  hero: {
    title: "Parlez une nouvelle langue avec confiance",
    subtitle:
      "Cours de français, d'anglais et d'espagnol en direct pour adultes, en groupe ou en individuel, avec le programme Idioma.",
    cta: "Réserver un cours d'essai",
    ctaTest: "Tester mon niveau",
  },
  features: [
    { title: "Cours en direct", text: "Vos cours ont lieu dans votre espace Idioma, sans logiciel à installer." },
    { title: "Programme Idioma", text: "Un parcours structuré du niveau A1 au C1, aligné sur le cadre européen (CECRL)." },
    { title: "Groupe ou individuel", text: "Petits groupes motivants ou cours particuliers selon votre rythme." },
    { title: "Certificat", text: "Un certificat vérifiable à la fin de chaque niveau." },
  ],
  courses: {
    title: "Nos cours",
    languages: { fr: "Français", en: "Anglais", es: "Espagnol" },
    levels: "Niveaux A1 à C1 · groupe ou individuel",
  },
  contact: {
    title: "Inscription et demande d'information",
    intro: "Laissez vos coordonnées, un conseiller vous recontacte sous 24 h.",
    name: "Nom complet",
    email: "E-mail",
    phone: "Téléphone (WhatsApp)",
    language: "Langue souhaitée",
    format: "Format",
    group: "En groupe",
    individual: "Individuel",
    message: "Message (optionnel)",
    submit: "Envoyer",
    success: "Merci ! Un conseiller Idioma vous contacte très bientôt.",
    error: "Une erreur est survenue. Merci de réessayer ou de nous écrire sur WhatsApp.",
  },
  test: {
    title: "Test de niveau gratuit",
    intro: "10 questions, environ 5 minutes. Recevez votre niveau estimé.",
    language: "Langue à tester",
    start: "Commencer",
    next: "Suivant",
    result: "Votre niveau estimé :",
    leaveContact: "Recevez votre résultat détaillé et une proposition de cours :",
  },
  footer: "Idioma Institute · Cours de langues en ligne pour adultes",
};

type Dict = typeof fr;

const en: Dict = {
  nav: { home: "Home", courses: "Our courses", test: "Level test", contact: "Enrol" },
  hero: {
    title: "Speak a new language with confidence",
    subtitle:
      "Live French, English and Spanish classes for adults, in groups or one-to-one, following the Idioma programme.",
    cta: "Book a trial class",
    ctaTest: "Test my level",
  },
  features: [
    { title: "Live classes", text: "Classes take place in your Idioma space, nothing to install." },
    { title: "Idioma programme", text: "A structured path from A1 to C1, aligned with the CEFR." },
    { title: "Group or one-to-one", text: "Small motivating groups or private lessons at your own pace." },
    { title: "Certificate", text: "A verifiable certificate at the end of each level." },
  ],
  courses: {
    title: "Our courses",
    languages: { fr: "French", en: "English", es: "Spanish" },
    levels: "Levels A1 to C1 · group or one-to-one",
  },
  contact: {
    title: "Enrolment and information",
    intro: "Leave your details and an advisor will get back to you within 24 hours.",
    name: "Full name",
    email: "Email",
    phone: "Phone (WhatsApp)",
    language: "Language",
    format: "Format",
    group: "Group",
    individual: "One-to-one",
    message: "Message (optional)",
    submit: "Send",
    success: "Thank you! An Idioma advisor will contact you soon.",
    error: "Something went wrong. Please try again or message us on WhatsApp.",
  },
  test: {
    title: "Free level test",
    intro: "10 questions, about 5 minutes. Get your estimated level.",
    language: "Language to test",
    start: "Start",
    next: "Next",
    result: "Your estimated level:",
    leaveContact: "Get your detailed result and a course proposal:",
  },
  footer: "Idioma Institute · Online language classes for adults",
};

const es: Dict = {
  nav: { home: "Inicio", courses: "Nuestros cursos", test: "Prueba de nivel", contact: "Inscripción" },
  hero: {
    title: "Habla un nuevo idioma con confianza",
    subtitle:
      "Clases en directo de francés, inglés y español para adultos, en grupo o individuales, con el programa Idioma.",
    cta: "Reservar una clase de prueba",
    ctaTest: "Probar mi nivel",
  },
  features: [
    { title: "Clases en directo", text: "Tus clases se dan en tu espacio Idioma, sin instalar nada." },
    { title: "Programa Idioma", text: "Un recorrido estructurado de A1 a C1, alineado con el MCER." },
    { title: "Grupo o individual", text: "Grupos reducidos y motivadores o clases particulares a tu ritmo." },
    { title: "Certificado", text: "Un certificado verificable al final de cada nivel." },
  ],
  courses: {
    title: "Nuestros cursos",
    languages: { fr: "Francés", en: "Inglés", es: "Español" },
    levels: "Niveles A1 a C1 · grupo o individual",
  },
  contact: {
    title: "Inscripción e información",
    intro: "Déjanos tus datos y un asesor te contactará en 24 horas.",
    name: "Nombre completo",
    email: "Correo electrónico",
    phone: "Teléfono (WhatsApp)",
    language: "Idioma",
    format: "Formato",
    group: "En grupo",
    individual: "Individual",
    message: "Mensaje (opcional)",
    submit: "Enviar",
    success: "¡Gracias! Un asesor de Idioma te contactará muy pronto.",
    error: "Se produjo un error. Inténtalo de nuevo o escríbenos por WhatsApp.",
  },
  test: {
    title: "Prueba de nivel gratuita",
    intro: "10 preguntas, unos 5 minutos. Obtén tu nivel estimado.",
    language: "Idioma a evaluar",
    start: "Empezar",
    next: "Siguiente",
    result: "Tu nivel estimado:",
    leaveContact: "Recibe tu resultado detallado y una propuesta de curso:",
  },
  footer: "Idioma Institute · Clases de idiomas en línea para adultos",
};

export const dictionaries: Record<Locale, Dict> = { fr, en, es };
export type Dictionary = Dict;
