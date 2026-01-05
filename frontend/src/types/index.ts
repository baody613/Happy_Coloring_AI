import { User as FirebaseUser } from "firebase/auth";

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  address?: string;
  orders?: string[];
  favorites?: string[];
  role?: "user" | "admin";
}

// Extended user with Firebase methods
export type AuthUser = User & {
  getIdToken: () => Promise<string>;
};

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  thumbnailUrl: string;
  difficulty: "easy" | "medium" | "hard";
  dimensions: string;
  colors: number;
  status: "active" | "inactive" | "deleted";
  sales: number;
  rating: number;
  reviews: Review[];
  createdAt: string;
}

export interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: Address;
  totalAmount: number;
  paymentMethod: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  postalCode?: string;
}

export interface Generation {
  id: string;
  userId: string;
  prompt: string;
  style: string;
  complexity: string;
  status: "processing" | "completed" | "failed";
  imageUrl?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}
