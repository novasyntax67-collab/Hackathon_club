"use client";

import { useState, useMemo, useEffect } from "react";
import { User, SystemRole, GlobalRole } from "@/lib/mockData";
import { getUsers, saveUser, deleteUser as removeUserFromStorage } from "@/lib/storage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  Search, 
  UserPlus, 
  Edit2, 
  Trash2, 
  X, 
  Mail, 
  Shield, 
  AlertCircle,
  Crown,
  Zap,
  Globe,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const GLOBAL_ROLES: GlobalRole[] = [
  "President",
  "Vice President",
  "Tech Lead",
  "Design Lead",
  "Social Media Lead",
  "Member"
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const loadData = () => {
    setUsers(getUsers());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage-update", loadData);
    return () => window.removeEventListener("storage-update", loadData);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<SystemRole | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{ 
    name: string; 
    email: string; 
    role: SystemRole; 
    globalRole: GlobalRole 
  }>({
    name: "",
    email: "",
    role: "participant",
    globalRole: "Member"
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({ 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        globalRole: user.globalRole 
      });
    } else {
      setEditingUser(null);
      setFormData({ 
        name: "", 
        email: "", 
        role: "participant", 
        globalRole: "Member" 
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      saveUser({ ...editingUser, ...formData });
    } else {
      const newUser: User = {
        id: `user-${Math.random().toString(36).substr(2, 5)}`,
        ...formData
      };
      saveUser(newUser);
    }
    handleCloseModal();
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      removeUserFromStorage(id);
    }
  };

  const getRoleIcon = (role: GlobalRole) => {
    switch (role) {
      case "President": return <Crown className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />;
      case "Vice President": return <Shield className="h-3.5 w-3.5 text-indigo-500 fill-indigo-500" />;
      case "Tech Lead": return <Zap className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500" />;
      case "Design Lead": return <Globe className="h-3.5 w-3.5 text-fuchsia-500 fill-fuchsia-100" />;
      case "Social Media Lead": return <Globe className="h-3.5 w-3.5 text-sky-500 fill-sky-100" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none mb-3">Platform Governance</h1>
          <p className="text-slate-500 font-bold text-sm">Assign global roles and manage executive permissions</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] h-14 px-8 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95"
        >
          <UserPlus className="mr-2 h-4 w-4" /> Add Executive Member
        </Button>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 border-none shadow-sm flex items-center gap-6 bg-white ring-1 ring-slate-100 rounded-[32px]">
          <div className="h-16 w-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Crown className="h-8 w-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Executives</p>
            <p className="text-3xl font-black text-slate-900 leading-none">
              {users.filter(u => u.globalRole !== "Member").length}
            </p>
          </div>
        </Card>
        <Card className="p-8 border-none shadow-sm flex items-center gap-6 bg-white ring-1 ring-slate-100 rounded-[32px]">
          <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Total Admins</p>
            <p className="text-3xl font-black text-slate-900 leading-none">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
        </Card>
        <Card className="p-8 border-none shadow-sm flex items-center gap-6 bg-white ring-1 ring-slate-100 rounded-[32px]">
          <div className="h-16 w-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
            <Globe className="h-8 w-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Total Community</p>
            <p className="text-3xl font-black text-slate-900 leading-none">{users.length}</p>
          </div>
        </Card>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden ring-1 ring-slate-50">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search by name, email or global role..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all placeholder:text-slate-300 shadow-inner"
            />
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 self-start md:self-center">
            {(["all", "admin", "participant"] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  roleFilter === role 
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50/50 border-b border-slate-50">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identitiy</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Auth Level</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/40 transition-all duration-300 group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl overflow-hidden ring-2 ring-slate-50 shadow-sm">
                          {user.avatar ? (
                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-400 font-black">
                              {user.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors text-base">{user.name}</p>
                          <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Mail className="h-3 w-3" /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                        user.globalRole === "President" ? "bg-amber-50 text-amber-700 border-amber-100" :
                        user.globalRole === "Vice President" ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                        user.globalRole === "Member" ? "bg-slate-50 text-slate-500 border-slate-100" :
                        "bg-emerald-50 text-emerald-700 border-emerald-100"
                      )}>
                        {getRoleIcon(user.globalRole)}
                        {user.globalRole}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <Badge 
                        className={cn(
                          "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border-none",
                          user.role === "admin" 
                            ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                            : "bg-slate-100 text-slate-400"
                        )}
                      >
                        {user.role} Access
                      </Badge>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        <button 
                          onClick={() => handleOpenModal(user)}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm font-bold"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-300">
                      <AlertCircle className="h-16 w-16 mb-6 opacity-20" />
                      <p className="font-black text-xl text-slate-400 tracking-tight">No participants matching criteria</p>
                      <p className="text-sm font-bold text-slate-300 mt-2">Try expanding your search or clearing filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl p-12 animate-in zoom-in-95 duration-500 border border-slate-100">
            <div className="flex justify-between items-center mb-10 shrink-0">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">
                  {editingUser ? "Edit Credentials" : "Add Executive"}
                </h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                  Configure global platform-level permissions
                </p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="h-14 w-14 rounded-[24px] bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-8 pr-2 custom-scrollbar overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-inner"
                    placeholder="e.g. Zeeshan Khan"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-inner"
                    placeholder="zeeshan@hackclub.com"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Platform Auth Level</label>
                <div className="grid grid-cols-2 gap-4">
                  {(["participant", "admin"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role })}
                      className={cn(
                        "py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2",
                        formData.role === role 
                          ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200" 
                          : "bg-white text-slate-400 border-slate-100 hover:border-indigo-100"
                      )}
                    >
                      {role} Access
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Global Designation</label>
                <select
                  value={formData.globalRole}
                  onChange={(e) => setFormData({ ...formData, globalRole: e.target.value as GlobalRole })}
                  className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  {GLOBAL_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="pt-8 flex gap-4 shrink-0">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1 h-16 rounded-2xl border-slate-100 text-slate-400 font-black uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-200"
                >
                  {editingUser ? "Seal Changes" : "Confirm Appointment"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
