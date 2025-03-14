import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../constants/Colors";
import { GEMINI_API_KEY } from "../../../constants/api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAppInfo } from "../../../constants/appInfo";
import { useProducts } from "../../hooks/useProducts";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Routes } from "../../navigation/Routes";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

export default function ChatBotScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { APP_INFO, generateAIContext } = useAppInfo();
  const { categories, subscriptionOffers, isDataReady, findProductById } =
    useProducts();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Bonjour! Je suis l'assistant virtuel de ${APP_INFO.name}. Comment puis-je vous aider aujourd'hui?`,
      sender: "bot",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [chat, setChat] = useState<any>(null);
  const [chatInitialized, setChatInitialized] = useState(false);

  // Memoize the context generation to prevent it from changing on every render
  const memoizedContext = useCallback(() => {
    return generateAIContext();
  }, [generateAIContext]);

  // Initialize Gemini AI and chat session only after data is ready
  useEffect(() => {
    // Only proceed if data is ready and chat hasn't been initialized yet
    if (!isDataReady || chatInitialized) return;

    let isMounted = true;

    // Check if we actually have data before initializing
    if (categories.length === 0 || subscriptionOffers.length === 0) {
      console.log(
        "No data available yet, waiting for products and categories..."
      );
      return;
    }

    console.log("Initializing chat with data:", {
      categoriesCount: categories.length,
      productsCount: subscriptionOffers.length,
    });

    const initializeChat = async () => {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Generate context with product data
        const appContext = memoizedContext();
        console.log("Chat context length:", appContext.length);

        // Debug info - print the first 500 characters and last 500 characters of context
        console.log("Context start:", appContext.substring(0, 500));
        console.log(
          "Context end:",
          appContext.substring(appContext.length - 500)
        );

        // Verify the context contains product information
        const containsProductInfo = appContext.includes(
          "Produits disponibles par catégorie"
        );
        console.log("Context contains product info:", containsProductInfo);

        // Try to directly use the categories and product data to ensure they are passed correctly
        const manualContext = `
Information sur l'application Cyna:

Catégories disponibles (${categories.length}):
${categories.map((cat) => `- ${cat.name} (ID: ${cat.id})`).join("\n")}

Produits disponibles (${subscriptionOffers.length}):
${subscriptionOffers
  .map((prod) => `- ${prod.name} (ID: ${prod.id}) - Prix: ${prod.price}€`)
  .join("\n")}
`;

        console.log("Manual context sample:", manualContext.substring(0, 200));

        // Use a combination of the generated context and manual context for more reliability
        const combinedContext =
          appContext + "\n\nDONNÉES SUPPLÉMENTAIRES:\n" + manualContext;

        const chatSession = model.startChat({
          history: [
            {
              role: "user",
              parts: [
                {
                  text: "Voici le contexte sur l'application Cyna, ses catégories et produits. Utilise ces informations pour répondre aux questions des utilisateurs, notamment sur les produits et catégories spécifiques.",
                },
              ],
            },
            {
              role: "model",
              parts: [
                {
                  text: "Compris. Je vais utiliser ces informations pour aider les utilisateurs de l'application Cyna, en particulier concernant les détails des produits et catégories disponibles.",
                },
              ],
            },
            {
              role: "user",
              parts: [{ text: combinedContext }],
            },
            {
              role: "model",
              parts: [
                {
                  text: "Merci pour ces informations détaillées sur l'application Cyna. Je suis maintenant prêt à répondre aux questions sur les fonctionnalités de l'application, les catégories disponibles, les produits spécifiques, ainsi que sur les aspects de livraison, paiement, et support client.",
                },
              ],
            },
            {
              role: "user",
              parts: [
                {
                  text: "IMPORTANT: Pour chaque produit que tu mentionneras, assure-toi d'inclure TOUJOURS son ID entre parenthèses exactement comme ceci: 'Service de paiement en ligne (ID: 3)'. Ce format est essentiel pour que l'utilisateur puisse cliquer sur les produits dans l'application.",
                },
              ],
            },
            {
              role: "model",
              parts: [
                {
                  text: "Je comprends parfaitement. Je veillerai à toujours mentionner l'ID de chaque produit entre parenthèses dans ce format précis : 'Nom du produit (ID: X)'. Cette convention permettra aux utilisateurs de cliquer sur les produits mentionnés dans l'interface de l'application.",
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1000,
          },
        });

        if (isMounted) {
          setChat(chatSession);
          setChatInitialized(true);
          console.log("Chat initialized successfully");

          // Add initialization success message
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: Date.now().toString(),
              text: "Je suis prêt à vous aider avec toutes vos questions sur nos produits et services. N'hésitez pas à me demander des informations sur nos offres disponibles !",
              sender: "bot",
            },
          ]);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);

        // Add error notification to user
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now().toString(),
            text: "Je suis actuellement en train de me connecter à nos services. Merci de patienter un instant ou de rafraîchir l'application si vous ne recevez pas de réponse.",
            sender: "bot",
          },
        ]);
      }
    };

    initializeChat();

    return () => {
      isMounted = false;
    };
  }, [
    isDataReady,
    memoizedContext,
    categories,
    subscriptionOffers,
    chatInitialized,
  ]);

  const sendMessage = async () => {
    if (!inputText.trim() || !chat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      // Get response from Gemini using the chat session
      const result = await chat.sendMessage(inputText.trim());
      const botResponse = await result.response.text();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.",
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Parse bot message to detect product mentions and make them clickable
  const renderMessageText = (text: string, sender: string) => {
    // If the message is from the user, just return the text
    if (sender === "user") {
      return <Text style={styles.messageText}>{text}</Text>;
    }

    // For bot messages, use a regex to find product mentions with (ID: X) format
    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    // This regex looks for the format "Product name (ID: 123)" which is commonly used
    const regex = /([^()]+)\s*\(ID:\s*(\d+)\)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add the text before this match
      if (match.index > lastIndex) {
        parts.push(
          <Text key={`text-${lastIndex}`} style={styles.messageText}>
            {text.substring(lastIndex, match.index)}
          </Text>
        );
      }

      // Extract the product name and ID
      const productName = match[1].trim();
      const productId = Number(match[2]);

      console.log("Found product mention:", productName, "with ID:", productId);

      // Find the product
      const product = findProductById(productId);

      if (product) {
        console.log("Product found in database:", product.name);
        // Make this part clickable
        parts.push(
          <Text
            key={`product-${productId}-${match.index}`}
            style={[styles.messageText, styles.productMention]}
            onPress={() => {
              console.log("Navigating to product:", product.name);
              navigation.navigate(Routes.ShopTab, {
                screen: Routes.ProductDetail,
                params: { product },
              });
            }}
          >
            {match[0]}
          </Text>
        );
      } else {
        console.log("Product not found in database:", productId);
        parts.push(
          <Text key={`nomatch-${match.index}`} style={styles.messageText}>
            {match[0]}
          </Text>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(
        <Text key={`text-end`} style={styles.messageText}>
          {text.substring(lastIndex)}
        </Text>
      );
    }

    if (parts.length > 0) {
      return <>{parts}</>;
    }

    const hasProdReference = /produit|service|offer|subscription/i.test(text);

    return (
      <>
        <Text style={styles.messageText}>{text}</Text>
        {hasProdReference && (
          <TouchableOpacity
            style={styles.showProductsButton}
            onPress={() => navigation.navigate(Routes.ShopTab)}
          >
            <Text style={styles.showProductsButtonText}>
              Voir tous les produits
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === "user" ? styles.userBubble : styles.botBubble,
            ]}
          >
            {renderMessageText(message.text, message.sender)}
          </View>
        ))}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.secondary} />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Tapez votre message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !chat && styles.disabledButton]}
          onPress={sendMessage}
          disabled={!chat}
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: "80%",
    marginVertical: 6,
  },
  userBubble: {
    backgroundColor: Colors.secondary,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: Colors.primary,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: "white",
    fontSize: 16,
  },
  loadingContainer: {
    padding: 10,
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  productMention: {
    textDecorationLine: "underline",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    padding: 2,
  },
  showProductsButton: {
    backgroundColor: Colors.secondary,
    padding: 8,
    borderRadius: 10,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  showProductsButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
