import { API, fetcher } from "./api";
import type { Post } from "../types/Post";

export const getPosts = () => fetcher<Post[]>(`${API}/posts`);

export const createPost = (body: Omit<Post, "id">) =>
  fetcher<Post>(`${API}/posts`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updatePost = (id: number, body: Partial<Omit<Post, "id">>) =>
  fetcher<Post>(`${API}/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const deletePost = (id: number) =>
  fetcher<{ ok: true }>(`${API}/posts/${id}`, {
    method: "DELETE",
  });
