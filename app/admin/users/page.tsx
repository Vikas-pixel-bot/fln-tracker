export const dynamic = 'force-dynamic';
import { getUsers, setUserRole } from '@/app/actions';
import { ShieldCheck, User, Clock, Activity } from 'lucide-react';

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">User Management</h1>
        <p className="text-slate-500 mt-1">Track logins and manage admin access for all platform users.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="grid grid-cols-4 bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-semibold uppercase tracking-wider px-6 py-3 border-b border-slate-100 dark:border-slate-800">
          <span>User</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last Login</span>
          <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Sessions</span>
          <span>Role</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {users.map((user) => (
            <div key={user.id} className="grid grid-cols-4 items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                {user.image ? (
                  <img src={user.image} alt={user.name ?? ''} className="w-9 h-9 rounded-full ring-2 ring-slate-100 flex-shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.name ?? '—'}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>

              <div className="text-sm text-slate-500">
                {user.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : <span className="text-slate-300 dark:text-slate-600">Never</span>}
              </div>

              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {user._count.sessions}
              </div>

              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  user.role === 'admin'
                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {user.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                  {user.role}
                </span>

                <form action={async () => {
                  'use server';
                  await setUserRole(user.id, user.role === 'admin' ? 'user' : 'admin');
                }}>
                  <button
                    type="submit"
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                      user.role === 'admin'
                        ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                        : 'text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20'
                    }`}
                  >
                    {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                  </button>
                </form>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-400">
              No users have signed in yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
