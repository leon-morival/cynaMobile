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

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

export default function ChatBotScreen() {
  const {
    APP_INFO,
    generateAIContext,
    isDataReady,
    categories,
    subscriptionOffers,
  } = useAppInfo();
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

  // Add debug message to show data status
  useEffect(() => {
    console.log(
      `ChatBotScreen - Data ready: ${isDataReady}, Categories: ${categories.length}, Products: ${subscriptionOffers.length}`
    );
  }, [isDataReady, categories.length, subscriptionOffers.length]);

  // Initialize Gemini AI and chat session only after data is ready
  useEffect(() => {
    // Only proceed if data is ready and chat hasn't been initialized yet
    if (!isDataReady || chatInitialized) return;

    let isMounted = true;

    // Check if we actually have data before initializing
    if (categories.length === 0 && subscriptionOffers.length === 0) {
      console.log("No data available yet, waiting...");
      return;
    }

    console.log("Initializing chat with data...");
    const initializeChat = async () => {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Get context after data is ready
        const appContext = memoizedContext();
        console.log(
          "Context generated - Categories section preview:",
          appContext
        );

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
              parts: [{ text: appContext }],
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
                  text: "Assure-toi de bien utiliser les informations sur les produits lorsqu'un utilisateur pose des questions sur un produit spécifique. Tu as accès à la liste complète des produits disponibles et leurs détails dans le contexte fourni.",
                },
              ],
            },
            {
              role: "model",
              parts: [
                {
                  text: "Je comprends. Je vais m'assurer d'utiliser les détails spécifiques des produits fournis dans le contexte pour répondre précisément aux questions des utilisateurs sur les produits. J'ai accès à leurs noms, descriptions, prix et catégories, et je les utiliserai pour donner des informations exactes.",
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
          console.log("Chat session successfully initialized!");
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    initializeChat();

    return () => {
      isMounted = false;
    };
  }, [
    isDataReady,
    memoizedContext,
    categories.length,
    subscriptionOffers.length,
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
            <Text style={styles.messageText}>{message.text}</Text>
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
});
