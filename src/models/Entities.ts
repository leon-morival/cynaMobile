export interface Category {
  id: number;
  name: string;
  image_path?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionOffer {
  id: number;
  name: string;
  price: number;
  image_path: string;
  description: string;
  category_id: number;
  created_at: string;
  updated_at: string;
}

export interface Orders {
  id: number;
  ht_price: number;
  ttc_price: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Tickets {
  id: number;
  subject: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface ClientSubscription {
  id: number;
  billing_method: string;
  started_at: string;
  end_at: string;
  price: number;
  is_active: boolean;
  is_renewable: boolean;
  user_id: number;
  subscription_offer_id: number;
  created_at: string;
  updated_at: string;
}

export interface Promotions {
  id: number;
  code: string;
  discound: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}
