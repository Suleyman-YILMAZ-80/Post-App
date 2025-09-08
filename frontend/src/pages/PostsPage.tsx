// frontend/src/pages/PostsPage.tsx
import { useMemo } from "react";
import { createPost, updatePost, deletePost } from "../services/post";
import type { Post } from "../types/Post";
import type { User } from "../types/Users";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import useSWR from "swr";
import { API_ROUTES } from "../constants/appConstants";
import { fetcher } from "../services/api";

export default function PostsPage({ users }: { users: User[] | undefined }) {
  const {
    data: posts,
    error,
    isLoading,
    mutate,
  } = useSWR<Post[]>(API_ROUTES.POSTS, fetcher);

  const userLookup: Record<number, string> = useMemo(() => {
    const list = Array.isArray(users) ? users : [];
    return list.reduce((acc, u) => {
      acc[u.id] = u.username;
      return acc;
    }, {} as Record<number, string>);
  }, [users]);

  const handleCreate = async (payload: Omit<Post, "id">) => {
    mutate(async (current = []) => {
      try {
        const created = await createPost(payload);
        return [created, ...current];
      } catch {
        return current; 
      }
    }, { revalidate: false });
  };

  const handleUpdate = async (p: Post) => {
    mutate(async (current = []) => {
      const before = [...current];
      try {
        const saved = await updatePost(p.id, {
          userId: p.userId,
          title: p.title,
          body: p.body,
        });
        return current.map((x) => (x.id === p.id ? saved : x));
      } catch {
        return before;
      }
    }, { revalidate: false });
  };

  const handleDelete = async (id: number) => {
    mutate(async (current = []) => {
      const before = [...current];
      try {
        await deletePost(id);
        return current.filter((p) => p.id !== id);
      } catch {
        return before;
      }
    }, { revalidate: false });
  };

  if (isLoading)
    return <div className="mx-auto max-w-5xl p-5">Yükleniyor…</div>;
  if (error)
    return (
      <div className="mx-auto max-w-5xl p-5 text-red-600">
        Hata: {String(error)}
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl p-5">
      <PostForm users={users} onCreate={handleCreate} />
      <section className="rounded-2xl border border-black/10 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
        <h2 className="mb-3 text-lg font-semibold">Posts</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts?.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              users={users}
              userLookup={userLookup}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
