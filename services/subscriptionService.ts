import { SubscriptionOffer, BillingMethod } from "../src/models/Entities";
import { API_URL } from "../constants/api";
interface CreateSubscriptionRequest {
  billing_method: BillingMethod;
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
