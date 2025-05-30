import { useEffect, useState } from "react";
import { API_URL } from "../../constants/api";
import { useLanguage } from "../context/LanguageContext";

let translationsCache: Record<string, Record<string, string>> | null = null;

async function fetchTranslations(): Promise<
  Record<string, Record<string, string>>
> {
  if (translationsCache) {
    return translationsCache;
  }

  try {
    const response = await fetch(`${API_URL}/translations`);
    if (!response.ok) {
      throw new Error("Failed to fetch translations");
    }
    const data = await response.json();

    // Transform the API response into the expected format
    const transformedData: Record<string, Record<string, string>> = {};
    data.forEach((item: { key: string; value: string; lang: string }) => {
      if (!transformedData[item.key]) {
        transformedData[item.key] = {};
      }
      transformedData[item.key][item.lang] = item.value;
    });

    translationsCache = transformedData;
    return transformedData;
  } catch (error) {
    console.error("Error fetching translations:", error);
    return {};
  }
}

// Hook personnalisé pour la traduction
export function useTranslate() {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Record<
    string,
    Record<string, string>
  > | null>(null);

  useEffect(() => {
    fetchTranslations().then(setTranslations);
  }, []);

  function translate(key: string): string {
    if (!translations) {
      return "";
    }
    return translations[key]?.[language] || "";
  }

  return translate;
}

export function translateEntity(
  translations: any[],

  entity: any
) {
  const { language } = useLanguage();
  const translation = translations.find((t) => t.lang === language);
  if (!translation) {
    return entity;
  }
  return {
    ...entity,
    name: translation.name,
    description: translation.description,
  };
}
