// ─── Auth ────────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  interests?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  name: string;
  email: string;
  message: string;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  description: string;
  imageURL: string;
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  description: string;
  imageURL: string;
  price: number;
  trending: boolean;
  popular: boolean;
  category: Category;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  productImageURL: string;
  quantity: number;
  subTotal: number;
}

export interface CartResponse {
  items: CartItem[];
  totalPrice: number;
}

export interface CartAddRequest {
  productId: number;
  quantity: number;
}

// ─── Wishlist ────────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  productImageURL: string;
  addedAt: string;
}

export interface WishlistResponse {
  items: WishlistItem[];
}

export interface WishlistAddRequest {
  productId: number;
}

export interface WishlistShareResponse {
  shareUrl: string;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderResponse {
  orderId: number;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface ProfileResponse {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  interests: string[];
  createdAt: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface UpdateInterestsRequest {
  interests: string[];
}

// ─── Deals ────────────────────────────────────────────────────────────────────

export interface Deal {
  id: number;
  product: Product;
  discountPrice: number;
  active: boolean;
}
