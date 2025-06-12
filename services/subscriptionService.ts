import { API_URL } from "../constants/api";
import apiClient from "../src/apiClient";

interface CreateSubscriptionRequest {
  subscription_offer_id: number;
  price: number;
}

export async function createClientSubscription(
  subscriptions: CreateSubscriptionRequest[],
  token: string
): Promise<boolean> {
  try {
    const response = await apiClient.post(
      "/client-subscriptions",
      subscriptions,
      {
        headers: {
          "Content-Type": "application/ld+json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Subscription creation response:", response.data);
    return true;
  } catch (error) {
    console.error("Error creating client subscription:", error);
    return false;
  }
}

export async function getUserSubscriptions(token: string) {
  const res = await apiClient.get("/subscriptions", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getSubscriptionInvoices(
  subscriptionId: number,
  token: string
) {
  const res = await apiClient.get(`/subscriptions/${subscriptionId}/invoices`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
