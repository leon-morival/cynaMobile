import { useState } from "react";
import { useStripe } from "@stripe/stripe-react-native";
import { createPaymentIntent } from "../../services/paymentService";
import Toast from "react-native-toast-message";

export const usePayment = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const initializePaymentSheet = async (
    amount: number,
    token: string | null
  ) => {
    try {
      setLoading(true);

      if (!token) {
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: "Vous devez être connecté pour effectuer un paiement.",
        });
        setLoading(false);
        return { error: new Error("Token manquant") };
      }

      // Get payment intent from your backend
      const { clientSecret } = await createPaymentIntent(amount, token);

      if (!clientSecret) {
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2:
            "Token invalide ou erreur lors de la récupération du paiement.",
        });
        setLoading(false);
        return { error: new Error("Token invalide ou clientSecret manquant") };
      }

      // Initialize the Payment Sheet
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Cyna Store",
        style: "alwaysLight",
      });

      if (error) {
        console.log("Error initializing payment sheet:", error);
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: error.message,
        });
      }

      setLoading(false);
      return { error };
    } catch (error) {
      console.log("Error in initializePaymentSheet:", error);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible d'initialiser le système de paiement",
      });
      setLoading(false);
      return { error };
    }
  };

  const handlePayment = async (amount: number, token: string | null) => {
    if (!token) {
      Toast.show({
        type: "error",
        text1: "Veuillez vous connecter avant de commander",
      });
      return { success: false };
    }

    // Initialize payment sheet
    const { error: initError } = await initializePaymentSheet(amount, token);
    if (initError) {
      console.log("Initialization error:", initError);
      return { success: false };
    }

    // Present the payment sheet
    const { error } = await presentPaymentSheet();
    if (error) {
      Toast.show({
        type: "error",
        text1: "Paiement échoué",
        text2: error.message,
      });
      return { success: false };
    }

    return { success: true };
  };

  return { loading, handlePayment };
};
