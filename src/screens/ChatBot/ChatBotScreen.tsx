import React, { useState, useRef, useEffect } from "react";
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
import { generateAIContext, APP_INFO } from "../../../constants/appInfo";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

export default function ChatBotScreen() {
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

  // Initialize Gemini AI and chat session
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Create a chat session with history and context
        const appContext = generateAIContext();
        const chatSession = model.startChat({
          history: [
            {
              role: "user",
              parts: [
                {
                  text: "Voici le contexte sur l'application Cyna. Utilise ces informations pour répondre aux questions des utilisateurs.",
                },
              ],
            },
            {
              role: "model",
              parts: [
                {
                  text: "Compris. Je vais utiliser ces informations pour aider les utilisateurs de l'application Cyna.",
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
                  text: "Merci pour ces informations sur l'application Cyna. Je suis prêt à aider les utilisateurs avec leurs questions concernant les fonctionnalités de l'application, les produits, la livraison, les paiements, les retours et tout autre aspect de l'expérience Cyna.",
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1000,
          },
        });

        setChat(chatSession);
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    initializeChat();
  }, []);

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
