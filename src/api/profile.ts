import client from "./client";
import { ProfileResponse, UpdateInterestsRequest, UpdateProfileRequest } from "../types";

export const getProfile = (userId: number) =>
  client.get<ProfileResponse>("/api/profile", { params: { userId } }).then((r) => r.data);

export const updateProfile = (userId: number, data: UpdateProfileRequest) =>
  client.put<ProfileResponse>("/api/profile", data, { params: { userId } }).then((r) => r.data);

export const updateInterests = (userId: number, data: UpdateInterestsRequest) =>
  client
    .put<ProfileResponse>("/api/profile/interests", data, { params: { userId } })
    .then((r) => r.data);
