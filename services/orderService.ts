import { BillingMethod } from "../src/models/Entities";
import { SubscriptionType } from "../src/hooks/useCart";
import { API_URL } from "../constants/api";
interface OrderRequest {
  ht_price: number;
  ttc_price: number;
}

interface CreateSubscriptionRequest {
  billing_method: BillingMethod;
  subscription_offer_id: number;
  price: number;
}

export const createOrder = async (
  amount: number,
  token: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ht_price: amount * 0.8, // Assuming 20% tax rate
        ttc_price: amount,
      }),
    });

    if (!response.ok) {
      console.error("Failed to create order record");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error creating order record:", error);
    return false;
  }
};

export const mapSubscriptionTypeToBackend = (
  type: SubscriptionType
): BillingMethod => {
  return type === "annual" ? BillingMethod.ANNUAL : BillingMethod.MENSUAL;
};

export const prepareClientSubscriptions = (
  cart: any[],
  subscriptionTypes: { [key: number]: SubscriptionType }
): CreateSubscriptionRequest[] => {
  return cart.map((item) => ({
    billing_method: mapSubscriptionTypeToBackend(subscriptionTypes[item.id]),
    subscription_offer_id: item.id,
    price: item.price * (subscriptionTypes[item.id] === "annual" ? 10 : 1),
  }));
};
