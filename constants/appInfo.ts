import { useEffect, useState, useMemo, useCallback } from "react";

import { API_URL } from "./api";
import { Category, SubscriptionOffer } from "../src/models/Entities";

export const useAppInfo = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscriptionOffers, setSubscriptionOffers] = useState<
    SubscriptionOffer[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDataReady, setIsDataReady] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const catResponse = await fetch(`${API_URL}/categories`);
        const catData = await catResponse.json();

        const offerResponse = await fetch(`${API_URL}/subscription-offers`);
        const offerData: SubscriptionOffer[] = await offerResponse.json();

        if (isMounted) {
          setCategories(catData.member || []);
          setSubscriptionOffers(offerData || []);
          setIsDataReady(true);
        }
      } catch (error) {
        console.error("Error fetching app data:", error);
        if (isMounted) {
          // Even if there's an error, we should mark data as ready so the app can proceed
          setIsDataReady(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Log data for debugging
  useEffect(() => {
    if (isDataReady) {
      console.log(
        `Data loaded: ${categories.length} categories, ${subscriptionOffers.length} products`
      );
    }
  }, [isDataReady, categories.length, subscriptionOffers.length]);

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

  // Memoize the context generation function to prevent recreation on every render
  const generateAIContext = useCallback(() => {
    // Create a mapping of category IDs to names for easy reference
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {} as Record<string, string>);

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

7. Catégories disponibles (${categories.length}):
${categories
  .map((category) => {
    // Count products in this category
    const productsInCategory = subscriptionOffers.filter(
      (offer) => offer.category_id === category.id
    );

    return `  - ${category.name} - ${productsInCategory.length} produits`;
  })
  .join("\n")}

8. Produits disponibles par catégorie:
${categories
  .map((category) => {
    const categoryProducts = subscriptionOffers.filter(
      (offer) => offer.category_id === category.id
    );

    if (categoryProducts.length === 0)
      return `  • ${category.name}: Aucun produit disponible`;

    return `  • ${category.name}:
${categoryProducts
  .map(
    (product) =>
      `    - ${product.name} - Prix: ${
        product.price
      }€ - ${product.description.substring(0, 80)}...`
  )
  .join("\n")}`;
  })
  .join("\n\n")}

9. Détails des produits populaires:
${subscriptionOffers
  .slice(0, 5)
  .map(
    (offer) => `
  • ${offer.name}:
    - Catégorie: ${categoryMap[offer.category_id] || "Non catégorisé"}
    - Prix: ${offer.price}€
    - Description complète: ${offer.description}
`
  )
  .join("\n")}

Instructions pour répondre aux questions:
1. Utiliser ces informations pour répondre aux questions sur l'application, les catégories et les produits disponibles.
2. Si un utilisateur demande des détails sur un produit spécifique, consultez la section "Détails des produits populaires" ou "Produits disponibles par catégorie".
4. Recommander les fonctionnalités pertinentes lorsque cela est approprié.
5. Maintenir un ton professionnel et amical.
6. Pour les questions techniques spécifiques ou problèmes, suggérer de contacter le support client.
7. Ne pas inventer d'informations qui ne sont pas incluses dans ce contexte.
`;
  }, [categories, subscriptionOffers, APP_INFO]);

  // Debug only a small portion of the context to avoid console clutter

  return {
    APP_INFO,
    categories,
    subscriptionOffers,
    isLoading,
    isDataReady,
    generateAIContext,
  };
};
