// frontend/src/pages/PostsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { getPosts, createPost, updatePost, deletePost } from "../services/post";
import type { Post } from "../types/Post";
import type { User } from "../types/Users";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

export default function PostsPage({ users }: { users: User[] }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const userLookup: Record<number, string> = useMemo(() => {
    const list = Array.isArray(users) ? users : [];
    return list.reduce((acc, u) => { acc[u.id] = u.username; return acc; }, {} as Record<number, string>);
  }, [users]);
  


  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const p = await getPosts();
        setPosts(p);
      } catch (e: any) {
        setErr(e?.message ?? "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = async (payload: Omit<Post, "id">) => {
    const optimistic = { id: Date.now(), ...payload } as Post;
    setPosts(prev => [optimistic, ...prev]);
    try {
      const created = await createPost(payload);
      setPosts(prev => prev.map(p => p.id === optimistic.id ? created : p));
    } catch {
      setPosts(prev => prev.filter(p => p.id !== optimistic.id));
      setErr("Create failed");
    }
  };

  const handleUpdate = async (p: Post) => {
    const before = posts;
    setPosts(prev => prev.map(x => x.id === p.id ? p : x));
    try {
      const saved = await updatePost(p.id, { userId: p.userId, title: p.title, body: p.body });
      setPosts(prev => prev.map(x => x.id === p.id ? saved : x));
    } catch { setPosts(before); setErr("Update failed"); }
  };

  const handleDelete = async (id: number) => {
    const before = posts;
    setPosts(prev => prev.filter(p => p.id !== id));
    try { await deletePost(id); }
    catch { setPosts(before); setErr("Delete failed"); }
  };

  if (loading) return <div className="mx-auto max-w-5xl p-5">Yükleniyor…</div>;
  if (err) return <div className="mx-auto max-w-5xl p-5 text-red-600">Hata: {err}</div>;

  return (
    <div className="mx-auto max-w-5xl p-5">
      <PostForm users={users} onCreate={handleCreate} />
      <section className="rounded-2xl border border-black/10 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
        <h2 className="mb-3 text-lg font-semibold">Posts</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((p) => (
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
