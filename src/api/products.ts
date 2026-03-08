import client from "./client";
import { Category, Product } from "../types";

export const getProducts = () =>
  client.get<Product[]>("/api/products").then((r) => r.data);

export const getProduct = (id: number) =>
  client.get<Product>(`/api/products/${id}`).then((r) => r.data);

export const getProductsByCategory = (categoryId: number) =>
  client.get<Product[]>(`/api/products/category/${categoryId}`).then((r) => r.data);

export const getTrendingProducts = () =>
  client.get<Product[]>("/api/products/trending").then((r) => r.data);

export const getPopularProducts = () =>
  client.get<Product[]>("/api/products/popular").then((r) => r.data);

export const searchProducts = (params: {
  q?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
}) => client.get<Product[]>("/api/products/search", { params }).then((r) => r.data);

export const getCategories = () =>
  client.get<Category[]>("/api/categories").then((r) => r.data);

export const getCategory = (id: number) =>
  client.get<Category>(`/api/categories/${id}`).then((r) => r.data);
