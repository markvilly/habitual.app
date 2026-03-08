import client from "./client";
import { Product, WishlistAddRequest, WishlistResponse, WishlistShareResponse } from "../types";

export const getWishlist = (userId: number) =>
  client.get<WishlistResponse>("/api/wishlist", { params: { userId } }).then((r) => r.data);

export const addToWishlist = (userId: number, data: WishlistAddRequest) =>
  client
    .post<WishlistResponse>("/api/wishlist/add", data, { params: { userId } })
    .then((r) => r.data);

export const removeFromWishlist = (userId: number, itemId: number) =>
  client
    .delete<WishlistResponse>(`/api/wishlist/remove/${itemId}`, { params: { userId } })
    .then((r) => r.data);

export const getSimilarFromWishlist = (userId: number) =>
  client.get<Product[]>("/api/wishlist/similar", { params: { userId } }).then((r) => r.data);

export const shareWishlist = (userId: number) =>
  client
    .post<WishlistShareResponse>("/api/wishlist/share", null, { params: { userId } })
    .then((r) => r.data);
