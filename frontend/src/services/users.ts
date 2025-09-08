import { API, http } from "./api"; 
import type { User } from "../types/Users";

export const getUsers = () => http<User[]>(`${API}/users`);

export const updateUser = (id: number, body: Partial<Omit<User,"id">>) =>
  http<User>(`${API}/users/${id}`, {
     method: "PUT", 
     body: JSON.stringify(body) 
    });

export const deleteUser = (id: number) =>
  http<{ ok: true }>(`${API}/users/${id}`, {
     method: "DELETE" 
    });

export const createUser = (body: Omit<User, "id">) =>
  http<User>(`${API}/users`, {
    method: "POST",
    body: JSON.stringify(body),
  });
