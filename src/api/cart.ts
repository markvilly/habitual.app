import client from "./client";
import { CartAddRequest, CartResponse, Product } from "../types";

export const getCart = (userId: number) =>
  client.get<CartResponse>("/api/cart", { params: { userId } }).then((r) => r.data);

export const addToCart = (userId: number, data: CartAddRequest) =>
  client.post<CartResponse>("/api/cart/add", data, { params: { userId } }).then((r) => r.data);

export const removeFromCart = (userId: number, itemId: number) =>
  client
    .delete<CartResponse>(`/api/cart/remove/${itemId}`, { params: { userId } })
    .then((r) => r.data);

export const getSimilarFromCart = (userId: number) =>
  client.get<Product[]>("/api/cart/similar", { params: { userId } }).then((r) => r.data);
