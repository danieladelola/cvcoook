import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  status: string;
  email_verified: boolean;
  role: string;
  plan: string;
  subscription_id: string | null;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
  last_sign_in: string | null;
}

interface ListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  per_page: number;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  const callEdge = useCallback(async (action: string, method: "GET" | "POST", params?: Record<string, string>, body?: Record<string, unknown>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users`);
    url.searchParams.set("action", action);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }

    const res = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  }, []);

  const fetchUsers = useCallback(async (page = 1, search = "", status = "", role = "") => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), per_page: "20" };
      if (search) params.search = search;
      if (status) params.status = status;
      if (role) params.role = role;

      const data: ListResponse = await callEdge("list", "GET", params);
      setUsers(data.users);
      setTotal(data.total);
    } catch (err: any) {
      toast({ title: "Error loading users", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [callEdge, toast]);

  const createUser = useCallback(async (payload: {
    email: string;
    password: string;
    full_name?: string;
    phone?: string;
    role?: string;
    email_verified?: boolean;
  }) => {
    setActionLoading(true);
    try {
      await callEdge("create", "POST", undefined, payload);
      toast({ title: "User created successfully" });
      return true;
    } catch (err: any) {
      toast({ title: "Failed to create user", description: err.message, variant: "destructive" });
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [callEdge, toast]);

  const updateUser = useCallback(async (payload: {
    user_id: string;
    full_name?: string;
    email?: string;
    phone?: string;
    role?: string;
    status?: string;
    email_verified?: boolean;
  }) => {
    setActionLoading(true);
    try {
      await callEdge("update", "POST", undefined, payload);
      toast({ title: "User updated successfully" });
      return true;
    } catch (err: any) {
      toast({ title: "Failed to update user", description: err.message, variant: "destructive" });
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [callEdge, toast]);

  const resetPassword = useCallback(async (userId: string, newPassword: string) => {
    setActionLoading(true);
    try {
      await callEdge("reset_password", "POST", undefined, { user_id: userId, new_password: newPassword });
      toast({ title: "Password reset successfully" });
      return true;
    } catch (err: any) {
      toast({ title: "Failed to reset password", description: err.message, variant: "destructive" });
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [callEdge, toast]);

  const deleteUser = useCallback(async (userId: string) => {
    setActionLoading(true);
    try {
      await callEdge("delete", "POST", undefined, { user_id: userId });
      toast({ title: "User deleted successfully" });
      return true;
    } catch (err: any) {
      toast({ title: "Failed to delete user", description: err.message, variant: "destructive" });
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [callEdge, toast]);

  const assignPlan = useCallback(async (userId: string, planId: string) => {
    setActionLoading(true);
    try {
      await callEdge("assign_plan", "POST", undefined, { user_id: userId, plan_id: planId });
      toast({ title: "Plan assigned successfully" });
      return true;
    } catch (err: any) {
      toast({ title: "Failed to assign plan", description: err.message, variant: "destructive" });
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [callEdge, toast]);

  return {
    users,
    total,
    loading,
    actionLoading,
    fetchUsers,
    createUser,
    updateUser,
    resetPassword,
    deleteUser,
    assignPlan,
  };
}
