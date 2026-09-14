"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/authService";
import { formatDate } from "@/utils/formatDate";
import { Search, X, ChevronLeft, ChevronRight, Users, UserCircle, Shield, GraduationCap, Briefcase } from "lucide-react";
import { Toast, ToastType } from "@/components/notification/Toast";

interface UserWithComplaints {
  id: string;
  full_name: string | null;
  role: string;
  created_at: string;
  complaintCount: number;
}

function getInitials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function getRoleColor(role: string) {
  switch (role) {
    case 'admin': return 'bg-red-50 text-red-700 border border-red-200/60';
    case 'staff': return 'bg-purple-50 text-purple-700 border border-purple-200/60';
    default: return 'bg-sky-50 text-sky-700 border border-sky-200/60';
  }
}

function getRoleIcon(role: string) {
  switch (role) {
    case 'admin': return Shield;
    case 'staff': return Briefcase;
    default: return GraduationCap;
  }
}

function getAvatarBg(role: string) {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-600';
    case 'staff': return 'bg-purple-100 text-purple-600';
    default: return 'bg-sky-100 text-sky-600';
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithComplaints[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithComplaints[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const itemsPerPage = 9;

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await authService.getAllUsers();
      setUsers(data as UserWithComplaints[]);
      setFilteredUsers(data as UserWithComplaints[]);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  useEffect(() => {
    let filtered = [...users];
    if (roleFilter !== "all") filtered = filtered.filter(u => u.role === roleFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(u =>
        u.full_name?.toLowerCase().includes(q) ||
        u.id?.toLowerCase().includes(q)
      );
    }
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, roleFilter, searchQuery]);

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const roleStats = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    staff: users.filter(u => u.role === 'staff').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingRole(userId);
    try {
      await authService.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setFilteredUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setToast({ message: `Role updated to ${newRole}`, type: "success" });
    } catch (error: any) {
      setToast({ message: error.message || "Failed to update role", type: "error" });
    } finally {
      setUpdatingRole(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.35rem] font-bold text-neutral-900 tracking-[-0.02em]">User Management</h1>
          <p className="text-[13px] text-neutral-500 mt-1">View and manage all registered users</p>
        </div>
        <button onClick={loadUsers} className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors">Refresh</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: roleStats.total, icon: Users, color: "text-neutral-600 bg-neutral-100" },
          { label: "Students", value: roleStats.students, icon: GraduationCap, color: "text-sky-600 bg-sky-50" },
          { label: "Staff", value: roleStats.staff, icon: Briefcase, color: "text-purple-600 bg-purple-50" },
          { label: "Admins", value: roleStats.admins, icon: Shield, color: "text-red-600 bg-red-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-neutral-200/80 p-4 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.06em]">{stat.label}</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-[1.5rem] font-bold text-neutral-900 tracking-[-0.03em]">{loading ? "—" : stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/40 hover:border-neutral-300 transition-all bg-white"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-0.5 p-0.5 bg-neutral-100 rounded-lg">
          {["all", "student", "staff", "admin"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all capitalize ${
                roleFilter === role ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {role === "all" ? "All" : role}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[12px] text-neutral-400 font-medium">
        {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
      </p>

      {/* Users Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl border border-neutral-200/80 p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg" />
                <div className="flex-1">
                  <div className="h-3.5 bg-neutral-100 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-neutral-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : paginatedUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {paginatedUsers.map((user) => {
            const RoleIcon = getRoleIcon(user.role);
            return (
              <div key={user.id} className="bg-white rounded-xl border border-neutral-200/80 p-4 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-250 group">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getAvatarBg(user.role)}`}>
                    <span className="text-[13px] font-semibold">{getInitials(user.full_name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-medium text-neutral-900 truncate">{user.full_name || "Unknown User"}</h3>
                    <p className="text-[12px] text-neutral-500 truncate font-mono">{user.id.slice(0, 8)}...</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap flex items-center gap-1 ${getRoleColor(user.role)}`}>
                    <RoleIcon className="w-3 h-3" />
                    {user.role}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[12px] text-neutral-500 mb-3">
                  <span>{formatDate(user.created_at)}</span>
                  <span className="font-medium">{user.complaintCount} complaint{user.complaintCount !== 1 ? 's' : ''}</span>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={updatingRole === user.id}
                    className="flex-1 px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/40 disabled:opacity-50 transition-all cursor-pointer hover:border-neutral-300"
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                  <a
                    href={`/admin/complaints`}
                    className="px-2.5 py-1.5 text-[12px] font-medium text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                  >
                    View
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-[13px] text-neutral-500">No users found</div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-neutral-400">Page {currentPage} of {totalPages}</p>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="gap-1">
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="gap-1">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
