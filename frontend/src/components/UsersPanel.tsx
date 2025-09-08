// frontend/src/components/UsersPanel.tsx
import { useEffect, useState } from "react";
import { getUsers,updateUser, deleteUser,createUser} from "../services/users";
import type { User } from "../types/Users";
import { Pencil, Trash, Check, X } from "lucide-react";

export default function UsersPanel({
  open,
  onClose,
  users,
  setUsers,
}: {
  open: boolean;
  onClose: () => void;
  users?: User[]; 
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}) {

  const [newName, setNewName] = useState("");
const [newUsername, setNewUsername] = useState("");
const [newEmail, setNewEmail] = useState("");
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const data = await getUsers();
        setUsers(data);   
      } catch (e) {
      }
    })();
  }, [open, setUsers]);



const handleCreate = async () => {
  const name = newName.trim();
  const username = newUsername.trim();
  const email = newEmail.trim();
  if (!name || !username || !email) return;

  const optimistic = { id: Date.now(), name, username, email } as User;
  setUsers(prev => [ ...prev, optimistic ]);
  setNewName(""); setNewUsername(""); setNewEmail("");

  try {
    const created = await createUser({ name, username, email });
    setUsers(prev => prev.map(u => u.id === optimistic.id ? created : u));
  } catch {
    // hata olursa geri al
    setUsers(prev => prev.filter(u => u.id !== optimistic.id));
  }
};


  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Users"
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform bg-white shadow-xl transition-transform dark:bg-slate-900
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between border-b border-black/10 px-4 py-3 dark:border-white/10">
          <h2 className="text-base font-semibold">Users</h2>
          <button
            className="rounded-lg border border-black/10 px-3 py-1 text-sm hover:bg-slate-50 dark:border-white/10"
            onClick={onClose}
          >
            <X className="h-6 w-4"/>
          </button>
        </header>

<div className="flex h-[calc(100%-57px)] flex-col">
  <ul className="flex-1 divide-y divide-black/10 overflow-y-auto dark:divide-white/10 scrollbar-hide">
    {users?.map((u) => (
      <UserRow
        key={u.id}
        user={u}
        onSave={async (patch) => {
          const before = users;
          setUsers(prev => prev.map(x => x.id === u.id ? { ...x, ...patch } : x));
          try {
            const saved = await updateUser(u.id, patch);
            setUsers(prev => prev.map(x => x.id === u.id ? saved : x));
          } catch {
            setUsers(before);
          }
        }}
        onDelete={async () => {
          const before = users;
          setUsers(prev => prev.filter(x => x.id !== u.id));
          try { await deleteUser(u.id); }
          catch { setUsers(before); }
        }}
      />
    ))}
  </ul>

  <div className="border-t border-black/10 p-4 dark:border-white/10">
  <h3 className="mb-2 font-semibold text-xl">Create User</h3>
  <div className="grid gap-2 sm:grid-cols-2">
    <input
      className="rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
      placeholder="Name"
      value={newName}
      onChange={(e) => setNewName(e.target.value)}
    />
    <input
      className="rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
      placeholder="Username"
      value={newUsername}
      onChange={(e) => setNewUsername(e.target.value)}
    />
  </div>

  <div className="mt-3">
    <input
      className="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
      placeholder="Email"
      value={newEmail}
      onChange={(e) => setNewEmail(e.target.value)}
    />
  </div>

  <div className="mt-3 flex justify-end">
    <button
      className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
      onClick={handleCreate}
      disabled={!newName.trim() || !newUsername.trim() || !newEmail.trim()}
    >
      Add User
    </button>
  </div>
</div>

</div>

      </aside>
    </>
  );
}

function UserRow({
  user,
  onSave,
  onDelete,
}: {
  user: User;
  onSave: (patch: Partial<Omit<User,"id">>) => void;
  onDelete: () => void;
}) {
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(user);
  useEffect(() => setDraft(user), [user]);

  return (
    <li className="p-4">
      {!edit ? (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs dark:bg-slate-800">
                {user.id}
              </span>
              <p className="truncate text-sm font-medium">{user.name}</p>
            </div>
            <p className="truncate text-xs text-slate-500 dark:text-slate-300 ml-6">@{user.username} • {user.email}</p>
          </div>
          <div className="shrink-0 space-x-2">
            <button className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-50 dark:border-white/10" onClick={() => setEdit(true)}>
            <Pencil className="inline-block h-6 w-4"/>
            </button>
            <button className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-500" onClick={onDelete}>
            <Trash className="inline-block h-6 w-4"/>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <input className="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
                 value={draft.name} onChange={(e)=>setDraft({ ...draft, name: e.target.value })} placeholder="Name"/>
          <input className="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
                 value={draft.username} onChange={(e)=>setDraft({ ...draft, username: e.target.value })} placeholder="Username"/>
          <input className="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
                 value={draft.email} onChange={(e)=>setDraft({ ...draft, email: e.target.value })} placeholder="Email"/>
          <div className="flex justify-end gap-2 pt-1">
            <button className="rounded-lg bg-slate-900 px-3 py-1 text-sm text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                    onClick={() => { onSave({ name: draft.name, username: draft.username, email: draft.email }); setEdit(false); }}>
              <Check className="inline-block h-6 w-4"/>
            </button>
            <button className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-50 dark:border-white/10"
                    onClick={() => { setDraft(user); setEdit(false); }}>
              <X className="inline-block h-6 w-4"/>
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
