import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MoreVertical, ShieldAlert, UserPlus, Loader2, Camera, FileText, ArrowRight } from 'lucide-react';
import AdminCreateUserModal from './AdminCreateUserModal';
import AdminComplianceActionModal from '../../components/admin/AdminComplianceActionModal';
import { supabase } from '../../lib/supabase';

export default function AdminUsers() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Compliance action modal state
  const [selectedUserForCompliance, setSelectedUserForCompliance] = useState<any | null>(null);
  const [complianceActionType, setComplianceActionType] = useState<'kyc' | 'nda'>('kyc');
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    const channel = supabase.channel('profiles_changes-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        fetchUsers();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const handleUserCreated = (newUser: any) => {
    setIsCreateModalOpen(false);
    fetchUsers();
  };

  return (
    <div className="animate-fade-in">
      {isCreateModalOpen && (
        <AdminCreateUserModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onUserCreated={handleUserCreated} 
        />
      )}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Users</h1>
          <p className="text-gray-500">Manage all registered accounts.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchUsers} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
            Refresh
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
        
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="animate-spin text-red-500" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">KYC Status</th>
                  <th className="px-6 py-4 font-medium">Account</th>
                  <th className="px-6 py-4 font-medium">Balance</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium text-right">Compliance Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <Link to={`/admin/users/${user.id}`} className="block">
                        <p className="font-bold text-brand-dark group-hover:text-red-600 transition-colors">{user.first_name || 'Unnamed'} {user.last_name || ''}</p>
                        <p className="text-xs text-gray-500 font-mono">{user.email}</p>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.kyc_status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : user.kyc_status === 'pending'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : user.kyc_status === 'rejected'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {user.kyc_status || 'unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.account_status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.account_status === 'suspended' ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-brand-dark">
                        ${Number(user.total_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedUserForCompliance(user);
                            setComplianceActionType('kyc');
                            setIsComplianceModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white border border-amber-200 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                          title="Suspend account and request live photographic KYC verification"
                        >
                          <Camera size={13} />
                          <span>Suspend & KYC</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUserForCompliance(user);
                            setComplianceActionType('nda');
                            setIsComplianceModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-700 text-brand-purple hover:text-white border border-purple-200 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                          title="Suspend account and request Master Agreement / NDA signature"
                        >
                          <FileText size={13} />
                          <span>Suspend & NDA</span>
                        </button>
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="p-1.5 text-gray-400 hover:text-brand-dark hover:bg-gray-100 rounded-lg transition-colors"
                          title="Manage User Details"
                        >
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Compliance Action Modal */}
      <AdminComplianceActionModal
        isOpen={isComplianceModalOpen}
        onClose={() => setIsComplianceModalOpen(false)}
        user={selectedUserForCompliance}
        actionType={complianceActionType}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
