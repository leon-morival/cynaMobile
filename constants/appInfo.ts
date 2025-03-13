export const APP_INFO = {
  name: "Cyna",
  version: "1.0.0",
  description: "Application e-commerce mobile pour tous vos besoins d'achat",
  features: [
    "Catalogue de produits variés",
    "Système de panier d'achat",
    "Paiements sécurisés",
    "Livraison gratuite sur les commandes supérieures à 50€",
    "Programme de fidélité",
    "Promotions régulières et offres spéciales",
    "Support client disponible 24/7",
  ],
  returns: "Retours acceptés dans les 30 jours suivant la réception",
  shipping: "Livraison standard en 3-5 jours ouvrés",
  paymentMethods: ["Carte de crédit", "PayPal", "Apple Pay", "Google Pay"],
};

// Generate a context string for the AI to understand the app
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

Instructions pour répondre aux questions:
1. Utiliser ces informations pour répondre aux questions sur l'application
2. Recommander les fonctionnalités pertinentes lorsque cela est approprié
3. Maintenir un ton professionnel et amical
4. Pour les questions techniques spécifiques ou problèmes, suggérer de contacter le support client
5. Ne pas inventer d'informations qui ne sont pas incluses dans ce contexte
`;
};
