// frontend/src/App.tsx
import { useEffect, useState } from "react";
import PostsPage from "./pages/PostsPage";
import UsersPanel from "./components/UsersPanel";
import { getUsers, type User } from "./services/users";
import {UserCircle} from "lucide-react";

export default function App() {
  const [usersOpen, setUsersOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (e: any) {
        setErr(e?.message ?? "Error");
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-5xl p-5 space-y-4">
        <nav className="mb-1 flex items-center justify-between rounded-2xl border border-black/10 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-800/70">
          <strong className="text-base">Admin Panel</strong>
          <div className="flex gap-2">
            <button
              className="rounded-xl border border-black/10 px-3 py-1 hover:bg-slate-50 dark:border-white/10"
              onClick={() => setUsersOpen(true)}
            >
              <UserCircle className="inline mr-1 -mt-1 h-5 w-5"/>
              Users
            </button>
          </div>
        </nav>

        {err && <div className="text-red-600">{err}</div>}

        <PostsPage users={users} />

        <UsersPanel
          open={usersOpen}
          onClose={() => setUsersOpen(false)}
          users={users}
          setUsers={setUsers}
        />
      </div>
    </div>
  );
}
