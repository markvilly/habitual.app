import client from "./client";
import { AuthResponse, LoginRequest, RegisterRequest } from "../types";

export const register = (data: RegisterRequest) =>
  client.post<AuthResponse>("/api/auth/register", data).then((r) => r.data);

export const login = (data: LoginRequest) =>
  client.post<AuthResponse>("/api/auth/login", data).then((r) => r.data);
