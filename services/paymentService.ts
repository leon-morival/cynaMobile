import apiClient from "../src/apiClient";
import { API_URL } from "../constants/api";

export async function startStripeCheckout(token: string): Promise<string> {
  try {
    const response = await apiClient.post(
      "/stripe/checkout",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.data.url) throw new Error("Stripe checkout URL not found");
    return response.data.url;
  } catch (error) {
    console.error("Error starting Stripe checkout:", error);
    throw error;
  }
}

export async function getStripePaymentIntent(token: string): Promise<string> {
  try {
    const response = await apiClient.post(
      "/stripe/payment-intent",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.data.clientSecret)
      throw new Error("Stripe clientSecret not found");
    return response.data.clientSecret;
  } catch (error) {
    console.error("Error getting Stripe PaymentIntent:", error);
    throw error;
  }
}
