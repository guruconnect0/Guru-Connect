import { Button } from '@/components/ui/button';

export function UsersTable({ users = [], loading }) {
  if (loading) {
    return (
      <div className="animate-pulse divide-y divide-white/5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-4 px-6 py-4 items-center">
            <div className="w-8 h-8 rounded-full bg-white/5 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-white/5 rounded w-1/3" />
              <div className="h-2 bg-white/5 rounded w-1/5" />
            </div>
            <div className="w-16 h-5 bg-white/5 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!users.length) {
    return <p className="text-gray-500 text-sm text-center py-10">No users found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-400 bg-white/5 uppercase">
          <tr>
            <th className="px-6 py-4 font-medium">Name</th>
            <th className="px-6 py-4 font-medium">Email</th>
            <th className="px-6 py-4 font-medium">Role</th>
            <th className="px-6 py-4 font-medium">Joined</th>
            <th className="px-6 py-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4 font-medium flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden shrink-0">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt=""
                    className="w-full h-full"
                  />
                </div>
                <span className="text-white">{user.name}</span>
              </td>
              <td className="px-6 py-4 text-gray-400">{user.email}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                  user.role === 'mentor'
                    ? 'bg-purple-500/10 text-purple-400'
                    : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-400">
                {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
