// Script temporaire pour supprimer toutes les traductions de 1 à 100
// À utiliser avec précaution !

const API_URL = "https://api.leonmorival.xyz/api/translations"; // Remplacez par l'URL réelle si besoin

async function deleteTranslations(from = 1, to = 100) {
  for (let id = from; id <= to; id++) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log(`Traduction ${id} supprimée.`);
      } else {
        console.warn(`Erreur suppression traduction ${id}: ${response.status}`);
      }
    } catch (err) {
      console.error(`Erreur suppression traduction ${id}:`, err);
    }
  }
}

// Appel direct pour exécution immédiate
deleteTranslations();
