import { API, http } from "./api";
import type { Post } from "../types/Post";

export const getPosts = () => http<Post[]>(`${API}/posts`);

export const createPost = (body: Omit<Post, "id">) =>
  http<Post>(`${API}/posts`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updatePost = (id: number, body: Partial<Omit<Post, "id">>) =>
  http<Post>(`${API}/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const deletePost = (id: number) =>
  http<{ ok: true }>(`${API}/posts/${id}`, {
    method: "DELETE",
  });
