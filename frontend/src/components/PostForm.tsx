import type { Post } from "../types/Post";
import { useState } from "react";
import type { User } from "../types/Users";


export default function PostForm({
  users,
  onCreate,
}: {
  users?: User[];
  onCreate: (p: Post) => Promise<void>;
}) {
  const [newUserId, setNewUserId] = useState<number | "">("");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  const handleCreate = async () => {
    if (!newUserId || !newTitle.trim()) return;
    const payload: Post = {
      userId: Number(newUserId),
      id: Date.now(), // optimistic id
      title: newTitle.trim(),
      body: newBody.trim(),
    };
    await onCreate(payload);
    setNewUserId("");
    setNewTitle("");
    setNewBody("");
  };

  return (
    <section className="mb-4 rounded-2xl border border-black/10 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/70 ">
      <h2 className="mb-3 text-lg">New Post</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 font-medium text-slate-700 dark:text-slate-200">
          <span className="ml-2 font-bold">User</span>
          <select
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-slate-900"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="" disabled hidden>
              Select User...
            </option>
            {users?.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 font-medium text-slate-700 dark:text-slate-200">
          <span className="ml-2 font-bold">Title</span>
          <input
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-slate-900"
            placeholder="Post Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </label>

        <label className="md:col-span-2 grid gap-1 font-medium text-slate-700 dark:text-slate-200">
          <span className="ml-2 font-bold">Body</span>
          <textarea
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-slate-900"
            rows={3}
            placeholder="Post Body..."
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
          />
        </label>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 active:translate-y-px disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
          onClick={handleCreate}
          disabled={!newUserId || !newTitle.trim()}
        >
          Share
        </button>
      </div>
    </section>
  );
}
