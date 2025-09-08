import { useEffect, useState } from "react";
import type { Post } from "../types/Post";
import type { User } from "../types/Users";
import {Pencil,Trash,Check, X} from "lucide-react";

type Mode = "view" | "edit";

export default function PostCard({
  post,
  users,
  userLookup,
  onUpdate,
  onDelete,
}: {
  post: Post;
  users?: User[];        
  userLookup: Record<number, string>;
  onUpdate: (p: Post) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [mode, setMode] = useState<Mode>("view");
  const [draft, setDraft] = useState<Post>(post);
  useEffect(() => setDraft(post), [post]);

  const handleSave = async () => {
    await onUpdate(draft);
    setMode("view");
  };

  return (
    <article className="h-36 w-74 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900">
      <header className="mb-2 flex items-center justify-between gap-2">
        <span className="inline-flex items-center rounded-full border border-black/10 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200">
          {userLookup[post.userId] ?? `User ${post.userId}`}
        </span>

        {mode === "view" ? (
          <div className="flex gap-2">
            <button className="inline-flex items-center rounded-xl border border-black/10 bg-white px-3 py-1.5 text-sm text-slate-900 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-slate-200" onClick={() => setMode("edit")}>
              <Pencil className="mr-1 h-4 w-4"/>
            </button>
            <button className="inline-flex items-center rounded-xl bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-500" onClick={() => onDelete(post.id)}>
              <Trash className="mr-1 h-4 w-4"/>
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500" onClick={handleSave}>
              <Check className="mr-1 h-4 w-4"/>
            </button>
            <button
              className="inline-flex items-center rounded-xl border border-black/10 bg-white px-3 py-1.5 text-sm text-slate-900 hover:bg-slate-500 dark:border-white/10 dark:bg-transparent dark:text-slate-200"
              onClick={() => { setDraft(post); setMode("view"); }}
            >
              <X className="mr-1 h-4 w-4"/>
            </button>
          </div>
        )}
      </header>

      {mode === "view" ? (
        <>
          <h3 className="text-xl font-semibold leading-tight">  {post.title.length > 25 ? post.title.substring(0, 20) + "..." : post.title}</h3>
          {post.body && <p className="text-sm text-slate-600 dark:text-slate-300 break-words">{post.body.length > 80 ? post.body.substring(0, 80) + "..." : post.body}</p>}
        </>
      ) : (
        <div className="grid gap-3">
  <label className="grid gap-1 font-medium text-slate-700 dark:text-slate-200">
    <span>User</span>
    <select
      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-slate-900"
      value={draft.userId}
      onChange={(e) =>
        setDraft({ ...draft, userId: Number(e.target.value) })
      }
    >
      {users?.map((u) => (
        <option key={u.id} value={u.id}>
          {u.username} (#{u.id})
        </option>
      ))}
    </select>
  </label>

  <label className="grid gap-1 font-medium text-slate-700 dark:text-slate-200">
    <span>Title</span>
    <input
      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-slate-900"
      value={draft.title}
      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
    />
  </label>

  <label className="grid gap-1 font-medium text-slate-700 dark:text-slate-200">
    <span>Body</span>
    <textarea
      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-slate-900"
      rows={3}
      value={draft.body ?? ""}
      onChange={(e) => setDraft({ ...draft, body: e.target.value })}
    />
  </label>
</div>

      )}
    </article>
  );
}
