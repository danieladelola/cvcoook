import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, UserPlus, MoreHorizontal, Edit, KeyRound, CreditCard, Trash2, Ban,
  CheckCircle, XCircle, Shield, Loader2, RefreshCw,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import UserFormDialog from "@/components/admin/UserFormDialog";
import ResetPasswordDialog from "@/components/admin/ResetPasswordDialog";
import AssignPlanDialog from "@/components/admin/AssignPlanDialog";
import { useAdminUsers, type AdminUser } from "@/hooks/use-admin-users";

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [resetPwUser, setResetPwUser] = useState<AdminUser | null>(null);
  const [assignPlanUser, setAssignPlanUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);

  const {
    users, total, loading, actionLoading,
    fetchUsers, createUser, updateUser, resetPassword, deleteUser: deleteUserAction, assignPlan,
  } = useAdminUsers();

  const loadUsers = useCallback(() => {
    fetchUsers(page, searchQuery, statusFilter, roleFilter);
  }, [page, searchQuery, statusFilter, roleFilter, fetchUsers]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchUsers(1, searchQuery, statusFilter, roleFilter);
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    const success = editUser ? await updateUser(data as any) : await createUser(data as any);
    if (success) { setFormOpen(false); setEditUser(null); loadUsers(); }
  };

  const handleResetPassword = async (password: string) => {
    if (resetPwUser) { const s = await resetPassword(resetPwUser.id, password); if (s) setResetPwUser(null); }
  };

  const handleAssignPlan = async (planId: string) => {
    if (assignPlanUser) { const s = await assignPlan(assignPlanUser.id, planId); if (s) { setAssignPlanUser(null); loadUsers(); } }
  };

  const handleDelete = async () => {
    if (deleteUser) { const s = await deleteUserAction(deleteUser.id); if (s) { setDeleteUser(null); loadUsers(); } }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const s = await updateUser({ user_id: user.id, status: user.status === "active" ? "suspended" : "active" });
    if (s) loadUsers();
  };

  const handleToggleVerified = async (user: AdminUser) => {
    const s = await updateUser({ user_id: user.id, email_verified: !user.email_verified });
    if (s) loadUsers();
  };

  const activeCount = users.filter((u) => u.status === "active").length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const subscribedCount = users.filter((u) => u.plan && u.plan !== "Free").length;

  return (
    <AdminLayout title="User Management">
      {/* Actions Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search users..." className="w-64 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(1); }}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v === "all" ? "" : v); setPage(1); }}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={loadUsers} className="gap-2"><RefreshCw className="h-4 w-4" />Refresh</Button>
          <Button onClick={() => { setEditUser(null); setFormOpen(true); }} className="gap-2"><UserPlus className="h-4 w-4" />Add User</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-5">
        {[
          { label: "Total Users", value: total, color: "text-foreground" },
          { label: "Active", value: activeCount, color: "text-secondary" },
          { label: "Admins", value: adminCount, color: "text-primary" },
          { label: "Subscribed", value: subscribedCount, color: "text-secondary" },
          { label: "Suspended", value: suspendedCount, color: "text-destructive" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Email Verified</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground">
                          {(user.full_name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.full_name || "—"}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${user.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {user.role === "admin" && <Shield className="h-3 w-3" />}{user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="rounded-full bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary">{user.plan}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${user.status === "active" ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>{user.status}</span>
                    </TableCell>
                    <TableCell>
                      <button onClick={() => handleToggleVerified(user)} className="flex items-center gap-1" title={user.email_verified ? "Click to unverify" : "Click to verify"}>
                        {user.email_verified ? <CheckCircle className="h-4 w-4 text-secondary" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
                        <span className="text-xs text-muted-foreground">{user.email_verified ? "Verified" : "Unverified"}</span>
                      </button>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditUser(user); setFormOpen(true); }}><Edit className="mr-2 h-4 w-4" />Edit User</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setResetPwUser(user)}><KeyRound className="mr-2 h-4 w-4" />Reset Password</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setAssignPlanUser(user)}><CreditCard className="mr-2 h-4 w-4" />Assign Plan</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(user)}><Ban className="mr-2 h-4 w-4" />{user.status === "active" ? "Suspend" : "Activate"}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteUser(user)}><Trash2 className="mr-2 h-4 w-4" />Delete User</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-border p-4">
          <p className="text-sm text-muted-foreground">Showing {users.length} of {total} users</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={users.length < 20} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <UserFormDialog open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) setEditUser(null); }} user={editUser} loading={actionLoading} onSubmit={handleFormSubmit} />
      <ResetPasswordDialog open={!!resetPwUser} onOpenChange={(open) => !open && setResetPwUser(null)} userName={resetPwUser?.full_name || resetPwUser?.email || ""} loading={actionLoading} onSubmit={handleResetPassword} />
      <AssignPlanDialog open={!!assignPlanUser} onOpenChange={(open) => !open && setAssignPlanUser(null)} userName={assignPlanUser?.full_name || assignPlanUser?.email || ""} loading={actionLoading} onSubmit={handleAssignPlan} />

      <AlertDialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete <strong>{deleteUser?.full_name || deleteUser?.email}</strong>. The user will be suspended and banned from signing in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={actionLoading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminUsers;
