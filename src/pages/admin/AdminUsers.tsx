import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MoreVertical, ShieldAlert, UserPlus } from 'lucide-react';
import AdminCreateUserModal from './AdminCreateUserModal';

export default function AdminUsers() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [users, setUsers] = useState([
    { id: 'usr_123', name: 'Jane Doe', email: 'jane@example.com', plan: 'Ultra', status: 'Active', reconScore: 92, joined: '2025-10-12' },
    { id: 'usr_124', name: 'Alex Smith', email: 'alex@example.com', plan: 'Base', status: 'Active', reconScore: 100, joined: '2026-01-05' },
    { id: 'usr_125', name: 'Sam Taylor', email: 'sam.taylor@gmail.com', plan: 'Free', status: 'Suspended', reconScore: 45, joined: '2026-08-20' },
  ]);

  const handleUserCreated = (newUser: any) => {
    setUsers([newUser, ...users]);
    setIsCreateModalOpen(false);
    // Real implementation would notify user, we handle that in SQL / backend.
  };

  return (
    <div className="animate-fade-in">
      {isCreateModalOpen && (
        <AdminCreateUserModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onUserCreated={handleUserCreated} 
        />
      )}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Users</h1>
          <p className="text-gray-500">Manage all registered accounts.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
            Export CSV
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
          >
            <UserPlus size={18} />
            Create Account
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, or ID..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <Filter size={16} /> Filters
          </button>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Plan</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Recon %</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <Link to={`/admin/users/${user.id}`} className="block">
                    <p className="font-bold text-brand-dark group-hover:text-red-600 transition-colors">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    user.plan === 'Free' ? 'bg-gray-100 text-gray-600' : 'bg-brand-purple/10 text-brand-purple'
                  }`}>
                    {user.plan}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${user.reconScore === 100 ? 'bg-green-500' : user.reconScore > 70 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${user.reconScore}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-brand-dark">{user.reconScore}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.joined}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-brand-dark hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
