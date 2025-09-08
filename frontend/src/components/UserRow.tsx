import { useEffect, useState } from "react";
import type { User } from "../types/Users";
import { Pencil, Trash, Check, X } from "lucide-react";

export default function UserRow({
    user,
    onSave,
    onDelete,
    editingId,
    setEditingId,
}: {
    user: User;
    onSave: (patch: Partial<Omit<User, "id">>) => void;
    onDelete: () => void;
    editingId: number | null;
    setEditingId: (id: number | null) => void;
}) {
    const [draft, setDraft] = useState(user);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => setDraft(user), [user]);

    const isEditing = editingId === user.id;

    const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    const handleSave = () => {
        if (!draft.name.trim() || !draft.username.trim() || !draft.email.trim()) {
            setError("Tüm alanlar doldurulmalıdır.");
            return;
        }
        if (!isValidEmail(draft.email)) {
            setError("Geçerli bir email giriniz.");
            return;
        }

        setError(null);
        onSave({
            name: draft.name,
            username: draft.username,
            email: draft.email,
        });
        setEditingId(null); 
    };

    return (
        <li className="p-4">
        {!isEditing ? (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs dark:bg-slate-800">
                  {user.id}
                </span>
                <p className="truncate text-sm font-medium">{user.name}</p>
              </div>
              <p className="truncate text-xs text-slate-500 dark:text-slate-300 ml-6">
                @{user.username} • {user.email}
              </p>
            </div>
            <div className="shrink-0 space-x-2">
              <button
                className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-50 dark:border-white/10"
                onClick={() => setEditingId(user.id)} // sadece birini açar
              >
                <Pencil className="inline-block h-6 w-4" />
              </button>
              <button
                className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-500"
                onClick={onDelete}
              >
                <Trash className="inline-block h-6 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Name
              </label>
              <input
                className="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Name"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Username
              </label>
              <input
                className="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
                value={draft.username}
                onChange={(e) => setDraft({ ...draft, username: e.target.value })}
                placeholder="Username"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                className={`w-full rounded-lg border px-3 py-2 dark:border-white/10 dark:bg-slate-900 ${
                  error?.includes("email") ? "border-red-500" : ""
                }`}
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                placeholder="Email"
              />
            </div>
  
            {error && <p className="text-sm text-red-500">{error}</p>}
  
            <div className="flex justify-end gap-2 pt-1">
              <button
                className="rounded-lg bg-slate-900 px-3 py-1 text-sm text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                onClick={handleSave}
              >
                <Check className="inline-block h-6 w-4" />
              </button>
              <button
                className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-50 dark:border-white/10"
                onClick={() => {
                  setDraft(user);
                  setEditingId(null); // iptal → çık
                  setError(null);
                }}
              >
                <X className="inline-block h-6 w-4" />
              </button>
            </div>
          </div>
        )}
      </li>
    );
}
