import client from "./client";
import { Deal, Product } from "../types";

export const getTrendingDeals = () =>
  client.get<Deal[]>("/api/deals/trending").then((r) => r.data);

export const getDealsByCategory = (categoryId: number) =>
  client.get<Deal[]>(`/api/deals/by-category/${categoryId}`).then((r) => r.data);

export const getDealsForYou = (userId?: number) =>
  client.get<Deal[]>("/api/deals/for-you", { params: userId ? { userId } : {} }).then((r) => r.data);

export const discoverByInterests = (userId: number) =>
  client.get<Product[]>("/api/interests/discover", { params: { userId } }).then((r) => r.data);

export const getInterestCategories = (userId: number) =>
  client.get<Product[]>("/api/interests/categories", { params: { userId } }).then((r) => r.data);
