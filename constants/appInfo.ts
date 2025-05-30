import { useMemo } from "react";

export const useAppInfo = () => {
  // Memoize APP_INFO to prevent unnecessary rerenders
  const APP_INFO = useMemo(() => {
    return {
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
  }, []);

  return {
    APP_INFO,
  };
};
