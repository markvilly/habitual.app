import { Product } from "../types";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Cart: undefined;
  Wishlist: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  ProductDetail: { productId: number };
};

export type OrderStackParamList = {
  OrderList: undefined;
  OrderDetail: { orderId: number };
};
