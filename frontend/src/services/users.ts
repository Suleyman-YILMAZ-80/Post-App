import { API, fetcher } from "./api"; 
import type { User } from "../types/Users";

export const getUsers = () => fetcher<User[]>(`${API}/users`);

export const updateUser = (id: number, body: Partial<Omit<User,"id">>) =>
  fetcher<User>(`${API}/users/${id}`, {
     method: "PUT", 
     body: JSON.stringify(body) 
    });

export const deleteUser = (id: number) =>
  fetcher<{ ok: true }>(`${API}/users/${id}`, {
     method: "DELETE" 
    });

export const createUser = (body: Omit<User, "id">) =>
  fetcher<User>(`${API}/users`, {
    method: "POST",
    body: JSON.stringify(body),
  });
