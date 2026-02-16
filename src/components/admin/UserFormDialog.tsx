import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { AdminUser } from "@/hooks/use-admin-users";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser | null;
  loading: boolean;
  onSubmit: (data: Record<string, unknown>) => void;
}

export default function UserFormDialog({
  open,
  onOpenChange,
  user,
  loading,
  onSubmit,
}: UserFormDialogProps) {
  const isEdit = !!user;
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
    email_verified: false,
    status: "active",
  });

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        role: user.role || "user",
        email_verified: user.email_verified,
        status: user.status || "active",
      });
    } else {
      setForm({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        role: "user",
        email_verified: false,
        status: "active",
      });
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      const payload: Record<string, unknown> = { user_id: user!.id };
      if (form.full_name !== user!.full_name) payload.full_name = form.full_name;
      if (form.email !== user!.email) payload.email = form.email;
      if (form.phone !== user!.phone) payload.phone = form.phone;
      if (form.role !== user!.role) payload.role = form.role;
      if (form.status !== user!.status) payload.status = form.status;
      if (form.email_verified !== user!.email_verified) payload.email_verified = form.email_verified;
      onSubmit(payload);
    } else {
      onSubmit({
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        phone: form.phone,
        role: form.role,
        email_verified: form.email_verified,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Create New User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isEdit && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={form.email_verified}
              onCheckedChange={(v) => setForm((f) => ({ ...f, email_verified: v }))}
            />
            <Label>Email Verified</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
