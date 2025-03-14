export const APP_INFO = {
  name: "Cyna",
  version: "1.0.0",
  description:
    "Application e-commerce mobile offrant une expérience fluide et sécurisée pour tous vos achats en ligne.",
  features: [
    "Catalogue de produits variés et mis à jour régulièrement",
    "Système de panier d'achat intuitif",
    "Paiements sécurisés via plusieurs méthodes",
    "Livraison gratuite sur les commandes supérieures à 50€",
    "Programme de fidélité avec points et récompenses",
    "Promotions régulières et offres exclusives",
    "Support client disponible 24/7 via chat et e-mail",
    "Suivi des commandes en temps réel",
    "Avis et recommandations des clients sur les produits",
    "Système de chatbot intelligent pour répondre aux questions rapidement",
  ],
  returns:
    "Retours acceptés dans les 30 jours suivant la réception, sous réserve que le produit soit en bon état et dans son emballage d'origine.",
  shipping:
    "Livraison standard en 3-5 jours ouvrés. Livraison express disponible sous 24h pour certaines zones.",
  paymentMethods: [
    "Carte de crédit",
    "PayPal",
    "Apple Pay",
    "Google Pay",
    "Virement bancaire",
  ],
  customerSupport: {
    availability: "24/7",
    contactMethods: ["Chatbot intégré", "E-mail", "Numéro de téléphone"],
    chatbotFeatures: [
      "Réponses instantanées aux questions fréquentes",
      "Assistance pour le suivi des commandes",
      "Guidage pour les retours et remboursements",
      "Suggestions personnalisées de produits",
    ],
  },
};

// Génération du contexte pour le chatbot
export const generateAIContext = (): string => {
  return `
Information sur l'application ${APP_INFO.name}:

1. Description générale:
  - ${APP_INFO.description}
  - Version actuelle: ${APP_INFO.version}

2. Fonctionnalités principales:
  ${APP_INFO.features.map((feature) => `- ${feature}`).join("\n  ")}

3. Politique de retour:
  - ${APP_INFO.returns}

4. Informations sur la livraison:
  - ${APP_INFO.shipping}
  - ${APP_INFO.features.find((f) => f.includes("Livraison gratuite")) || ""}

5. Méthodes de paiement acceptées:
  ${APP_INFO.paymentMethods.map((method) => `- ${method}`).join("\n  ")}

6. Support client et chatbot:
  - Disponibilité: ${APP_INFO.customerSupport.availability}
  - Méthodes de contact:
    ${APP_INFO.customerSupport.contactMethods
      .map((method) => `- ${method}`)
      .join("\n    ")}
  - Fonctionnalités du chatbot:
    ${APP_INFO.customerSupport.chatbotFeatures
      .map((feature) => `- ${feature}`)
      .join("\n    ")}

Instructions pour répondre aux questions:
1. Utiliser ces informations pour répondre aux questions sur l'application.
2. Recommander les fonctionnalités pertinentes lorsque cela est approprié.
3. Maintenir un ton professionnel et amical.
4. Pour les questions techniques spécifiques ou problèmes, suggérer de contacter le support client.
5. Ne pas inventer d'informations qui ne sont pas incluses dans ce contexte.
`;
};
