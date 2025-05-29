export interface Category {
  id: number;
  created_at: string;
  updated_at: string;
  translations: CategoryTranslation[];
}

export interface CategoryTranslation {
  id: number;
  name: string;
  description: string;
  lang: string;
  category_id: number;
  created_at: string;
  updated_at: string;
}

export enum Civilite {
  MR = "mr",
  MME = "mme",
  ENT = "ent",
  AUT = "aut",
}

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
  deleted?: boolean;
  civilite: Civilite;
  company_name?: string;
  vat_number?: string;
  address?: any;
  created_at: string;
  updated_at: string;
  role: Role;
}

export enum OrderStatus {
  PENDING = "pending",
  PAID = "paid",
  CANCELED = "canceled",
  REFUNDED = "refunded",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum Status {
  CANCELED = "canceled",
  ACTIVE = "active",
  WAITING = "waiting",
}

export enum SubscriptionType {
  MENSUAL = "mensual",
  ANNUAL = "annual",
  LIFETIME = "lifetime",
}

export interface Product {
  id: number;
  price: number;
  image: string;
  description?: string;
  tax_rate?: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  translations: ProductTranslation[];
}

export interface ProductTranslation {
  name: string;
  description?: string;
  lang: string;
  product_id: number;
}

export interface Orders {
  id: number;
  ht_price?: number;
  ttc_price?: number;
  user_id: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  order_id: number;
  ht_price?: number;
  ttc_price?: number;
  quantity: number;
}

export interface Subscription {
  id: number;
  created_at: string;
  user_id: number;
  order_item_id: number;
  subscription_type: SubscriptionType;
  status: Status;
  licence_key?: string;
  start_date?: string;
  end_date?: string;
}

export interface Invoice {
  id: number;
  number: string;
  subscription_id: number;
  order_id?: number;
  ht_amount: number;
  tax_amount: number;
  ttc_amount: number;
  period_start?: string;
  period_end?: string;
  created_at: string;
}

export interface Payment {
  id: number;
  invoice_id: number;
  amount: number;
  status: PaymentStatus;
  transaction_id: string;
  payment_method: string;
  subscription_id?: number;
  created_at?: string;
}

export interface Carousel {
  id: number;
  image?: string;
}

export interface CarouselTranslation {
  content?: string;
  lang: string;
  carousel_id: number;
}

export interface Translation {
  key: string;
  value: string;
  lang: string;
}
