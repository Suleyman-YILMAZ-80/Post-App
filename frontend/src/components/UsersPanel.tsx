// frontend/src/components/UsersPanel.tsx
import { useState } from "react";
import { updateUser, deleteUser, createUser } from "../services/users";
import type { User } from "../types/Users";
import { X } from "lucide-react";
import UserRow from "./UserRow";   // 👈 yeni import

export default function UsersPanel({
  open,
  onClose,
  users,
  mutateUsers,
}: {
  open: boolean;
  onClose: () => void;
  users?: User[];
  mutateUsers: () => void;
}) {
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleClose = () => {
    setEditingId(null);
    setError(null);
    setNewName("");
    setNewUsername("");
    setNewEmail("");
    onClose();
  };

  const handleCreate = async () => {
    const name = newName.trim();
    const username = newUsername.trim();
    const email = newEmail.trim();
  
    if (!name || !username || !email) {
      setError("Tüm alanlar doldurulmalıdır.");
      return;
    }
  
    if (!isValidEmail(email)) {
      setError("Geçerli bir email adresi giriniz.");
      return;
    }
  
    setError(null);
  
    setNewName("");
    setNewUsername("");
    setNewEmail("");
  
    try {
      await createUser({ name, username, email });
    } catch {
      console.error("Create user failed");
    } finally {
      mutateUsers();
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={handleClose}
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
            onClick={handleClose}
          >
            <X className="h-6 w-4" />
          </button>
        </header>

        <div className="flex h-[calc(100%-57px)] flex-col">
          <ul className="flex-1 divide-y divide-black/10 overflow-y-auto dark:divide-white/10 scrollbar-hide">
            {users?.map((u) => (
              <UserRow
                key={u.id} 
                user={u}
                editingId={editingId}
                setEditingId={setEditingId}
                onSave={async (patch) => {
                  try {
                    await updateUser(u.id, patch);
                    mutateUsers();
                  } catch {
                    console.error("Update user failed");
                  }
                }}
                onDelete={async () => {
                  try {
                    await deleteUser(u.id);
                    mutateUsers();
                  } catch {
                    console.error("Delete user failed");
                  }
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
      className={`w-full rounded-lg border px-3 py-2 dark:border-white/10 dark:bg-slate-900 
                 ${error?.includes("email") ? "border-red-500" : ""}`}
      placeholder="Email"
      value={newEmail}
      onChange={(e) => setNewEmail(e.target.value)}
    />
  </div>

  {error && (
    <p className="mt-2 text-sm text-red-500">{error}</p>
  )}

  <div className="mt-3 flex justify-end">
    <button
      className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer disabled:cursor-not-allowed"
      onClick={handleCreate}
      disabled={ !newName.trim() || !newUsername.trim() || !newEmail.trim() }
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
