import { useMemo, useCallback } from "react";
import { useProducts } from "../src/hooks/useProducts";

export const useAppInfo = () => {
  const {
    categories,
    subscriptionOffers,
    isLoading,
    isDataReady,
    error,
    findProductById,
    getProductsByCategory,
  } = useProducts();

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
    console.log("Generating AI context with:", {
      categoriesCount: categories.length,
      productsCount: subscriptionOffers.length,
    });

    // Verify data exists before proceeding
    if (categories.length === 0 || subscriptionOffers.length === 0) {
      console.warn("Missing data for AI context: categories or products empty");
      // Return a minimal context that indicates data is missing
      return `
Information sur l'application ${APP_INFO.name}:
[Données des produits en cours de chargement...]
Les données complètes des produits et catégories ne sont pas encore disponibles.
`;
    }

    // Create a mapping of category IDs to names for easy reference
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {} as Record<string, string>);

    // Create a simpler, more direct context with key product information
    const productsList = subscriptionOffers
      .map(
        (product) =>
          `- ${product.name} (ID: ${product.id}) - Catégorie: ${
            categoryMap[product.category_id] || "Non catégorisé"
          } - Prix: ${product.price}€ - ${product.description.substring(
            0,
            100
          )}...`
      )
      .join("\n");

    const categoriesList = categories
      .map((category) => {
        const productsInCategory = getProductsByCategory(category.id);
        return `- ${category.name} (${productsInCategory.length} produits)`;
      })
      .join("\n");

    // Build the context with relevant information
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

7. Catégories disponibles (${categories.length}):
${categoriesList}

8. LISTE COMPLÈTE DES PRODUITS (${subscriptionOffers.length}):
${productsList}

9. Produits par catégorie:
${categories
  .map((category) => {
    const categoryProducts = getProductsByCategory(category.id);

    if (categoryProducts.length === 0)
      return `  • ${category.name}: Aucun produit disponible`;

    return `  • ${category.name}:
${categoryProducts
  .map(
    (product) =>
      `    - ${product.name} (ID: ${product.id}) - Prix: ${
        product.price
      }€ - ${product.description.substring(0, 80)}...`
  )
  .join("\n")}`;
  })
  .join("\n\n")}

INSTRUCTIONS IMPORTANTES:
1. Utilise TOUJOURS ce format exact pour mentionner les produits: "Nom du produit (ID: X)" pour que les utilisateurs puissent cliquer dessus.
2. Recommande les fonctionnalités pertinentes quand approprié.
3. Maintiens un ton professionnel et amical.
4. Pour les questions techniques spécifiques, suggère de contacter le support client.
5. Ne pas inventer d'informations qui ne sont pas incluses dans ce contexte.
`;
  }, [categories, subscriptionOffers, APP_INFO, getProductsByCategory]);

  return {
    APP_INFO,
    categories,
    subscriptionOffers,
    isLoading,
    isDataReady,
    error,
    findProductById,
    getProductsByCategory,
    generateAIContext,
  };
};
