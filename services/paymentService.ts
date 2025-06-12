import { API_URL } from "../constants/api";

export async function startStripeCheckout(token: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/stripe/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    if (!data.url) throw new Error("Stripe checkout URL not found");
    return data.url;
  } catch (error) {
    console.error("Error starting Stripe checkout:", error);
    throw error;
  }
}

export async function getStripePaymentIntent(token: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/stripe/payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    if (!data.clientSecret) throw new Error("Stripe clientSecret not found");
    return data.clientSecret;
  } catch (error) {
    console.error("Error getting Stripe PaymentIntent:", error);
    throw error;
  }
}
