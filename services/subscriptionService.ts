import { API_URL } from "../constants/api";
interface CreateSubscriptionRequest {
  subscription_offer_id: number;
  price: number;
}

export async function createClientSubscription(
  subscriptions: CreateSubscriptionRequest[],
  token: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/client-subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/ld+json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscriptions),
    });

    if (!response.ok) {
      const errorText = await response.json();
      console.error(`Error creating subscriptions: ${errorText}`);
      return false;
    }

    const data = await response.json();
    console.log("Subscription creation response:", data);
    return true;
  } catch (error) {
    console.error("Error creating client subscription:", error);
    return false;
  }
}

export async function getUserSubscriptions(token: string) {
  const res = await fetch(`${API_URL}/subscriptions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch subscriptions");
  return await res.json();
}

export async function getSubscriptionInvoices(
  subscriptionId: number,
  token: string
) {
  const res = await fetch(
    `${API_URL}/subscriptions/${subscriptionId}/invoices`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return await res.json();
}
