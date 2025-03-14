import { API_URL } from "../constants/api";
interface PaymentIntentResponse {
  clientSecret: string;
}

export async function createPaymentIntent(
  amount: number,
  token: string
): Promise<PaymentIntentResponse> {
  try {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // updated to use dynamic token
      },
      body: JSON.stringify({
        amount: amount * 100,
        currency: "eur",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // Map the secret from data if returned as "client_secret"
    return { clientSecret: data.client_secret || data.clientSecret };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
}
