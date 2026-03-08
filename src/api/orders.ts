import client from "./client";
import { OrderResponse } from "../types";

export const placeOrder = (userId: number) =>
  client.post<OrderResponse>("/api/orders", null, { params: { userId } }).then((r) => r.data);

export const getOrders = (userId: number) =>
  client.get<OrderResponse[]>("/api/orders", { params: { userId } }).then((r) => r.data);

export const getInProgressOrders = (userId: number) =>
  client.get<OrderResponse[]>("/api/orders/in-progress", { params: { userId } }).then((r) => r.data);

export const getOrder = (userId: number, id: number) =>
  client.get<OrderResponse>(`/api/orders/${id}`, { params: { userId } }).then((r) => r.data);
