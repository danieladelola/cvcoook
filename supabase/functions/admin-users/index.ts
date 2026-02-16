import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: Admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // Helper to log audit
    const logAudit = async (actionName: string, targetUserId: string | null, details: Record<string, unknown> = {}) => {
      await supabaseAdmin.from("admin_audit_log").insert({
        admin_id: caller.id,
        action: actionName,
        target_user_id: targetUserId,
        details,
      });
    };

    // LIST USERS
    if (req.method === "GET" && action === "list") {
      const page = parseInt(url.searchParams.get("page") || "1");
      const perPage = parseInt(url.searchParams.get("per_page") || "20");
      const search = url.searchParams.get("search") || "";
      const statusFilter = url.searchParams.get("status") || "";
      const roleFilter = url.searchParams.get("role") || "";

      // Get auth users
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });

      if (authError) throw authError;

      // Get profiles with filters
      let profilesQuery = supabaseAdmin
        .from("profiles")
        .select("*")
        .is("deleted_at", null);

      if (statusFilter) {
        profilesQuery = profilesQuery.eq("status", statusFilter);
      }

      const { data: profiles } = await profilesQuery;

      // Get roles
      const { data: roles } = await supabaseAdmin.from("user_roles").select("*");

      // Get subscriptions with plan info
      const { data: subscriptions } = await supabaseAdmin
        .from("user_subscriptions")
        .select("*, plans(name)");

      // Merge data
      const users = (authData?.users || []).map((authUser) => {
        const profile = profiles?.find((p) => p.user_id === authUser.id);
        const userRoles = roles?.filter((r) => r.user_id === authUser.id) || [];
        const sub = subscriptions?.find((s) => s.user_id === authUser.id && s.status === "active");

        // Skip soft-deleted users
        if (!profile) return null;

        return {
          id: authUser.id,
          email: authUser.email,
          full_name: profile?.full_name || "",
          phone: profile?.phone || "",
          status: profile?.status || "active",
          email_verified: !!authUser.email_confirmed_at,
          role: userRoles.find((r) => r.role === "admin")?.role || (userRoles.length > 0 ? userRoles[0].role : "user"),
          plan: sub ? (sub as any).plans?.name : "Free",
          subscription_id: sub?.id || null,
          created_at: authUser.created_at,
          updated_at: profile?.updated_at,
          avatar_url: profile?.avatar_url,
          last_sign_in: authUser.last_sign_in_at,
        };
      }).filter(Boolean);

      // Apply search filter
      let filtered = users;
      if (search) {
        const s = search.toLowerCase();
        filtered = users.filter((u: any) =>
          u.full_name?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s) ||
          u.phone?.toLowerCase().includes(s)
        );
      }

      if (roleFilter) {
        filtered = filtered.filter((u: any) => u.role === roleFilter);
      }

      return new Response(JSON.stringify({
        users: filtered,
        total: authData?.total || filtered.length,
        page,
        per_page: perPage,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // All other actions use POST
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();

    // CREATE USER
    if (action === "create") {
      const { email, password, full_name, phone, role, email_verified } = body;

      if (!email || !password) {
        return new Response(JSON.stringify({ error: "Email and password required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: email_verified ?? false,
        user_metadata: { full_name: full_name || "" },
      });

      if (createError) {
        return new Response(JSON.stringify({ error: createError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update profile fields
      if (phone) {
        await supabaseAdmin
          .from("profiles")
          .update({ phone })
          .eq("user_id", newUser.user.id);
      }

      // Set role if not default
      if (role && role !== "user") {
        await supabaseAdmin
          .from("user_roles")
          .update({ role })
          .eq("user_id", newUser.user.id);
      }

      await logAudit("create_user", newUser.user.id, { email, role });

      return new Response(JSON.stringify({ user: newUser.user }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // UPDATE USER
    if (action === "update") {
      const { user_id, full_name, email, phone, role, status, email_verified } = body;

      if (!user_id) {
        return new Response(JSON.stringify({ error: "user_id required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const changes: Record<string, unknown> = {};

      // Update auth user
      const authUpdates: Record<string, unknown> = {};
      if (email !== undefined) authUpdates.email = email;
      if (email_verified !== undefined) {
        authUpdates.email_confirm = email_verified;
      }

      if (Object.keys(authUpdates).length > 0) {
        const { error } = await supabaseAdmin.auth.admin.updateUserById(user_id, authUpdates);
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        Object.assign(changes, authUpdates);
      }

      // Update profile
      const profileUpdates: Record<string, unknown> = {};
      if (full_name !== undefined) profileUpdates.full_name = full_name;
      if (phone !== undefined) profileUpdates.phone = phone;
      if (status !== undefined) profileUpdates.status = status;

      if (Object.keys(profileUpdates).length > 0) {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update(profileUpdates)
          .eq("user_id", user_id);
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        Object.assign(changes, profileUpdates);
      }

      // Update role
      if (role !== undefined) {
        const { error } = await supabaseAdmin
          .from("user_roles")
          .update({ role })
          .eq("user_id", user_id);
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        changes.role = role;
      }

      await logAudit("update_user", user_id, changes);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // RESET PASSWORD
    if (action === "reset_password") {
      const { user_id, new_password } = body;

      if (!user_id || !new_password) {
        return new Response(JSON.stringify({ error: "user_id and new_password required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
        password: new_password,
      });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await logAudit("reset_password", user_id);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // SOFT DELETE
    if (action === "delete") {
      const { user_id } = body;

      if (!user_id) {
        return new Response(JSON.stringify({ error: "user_id required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Prevent self-deletion
      if (user_id === caller.id) {
        return new Response(JSON.stringify({ error: "Cannot delete your own account" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Soft delete: mark profile
      await supabaseAdmin
        .from("profiles")
        .update({ deleted_at: new Date().toISOString(), status: "suspended" })
        .eq("user_id", user_id);

      // Ban auth user
      await supabaseAdmin.auth.admin.updateUserById(user_id, {
        ban_duration: "876000h", // ~100 years
      });

      await logAudit("delete_user", user_id);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ASSIGN PLAN
    if (action === "assign_plan") {
      const { user_id, plan_id } = body;

      if (!user_id || !plan_id) {
        return new Response(JSON.stringify({ error: "user_id and plan_id required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check for existing active subscription
      const { data: existingSub } = await supabaseAdmin
        .from("user_subscriptions")
        .select("id")
        .eq("user_id", user_id)
        .eq("status", "active")
        .maybeSingle();

      if (existingSub) {
        // Update existing
        await supabaseAdmin
          .from("user_subscriptions")
          .update({
            plan_id,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq("id", existingSub.id);
      } else {
        // Create new
        await supabaseAdmin.from("user_subscriptions").insert({
          user_id,
          plan_id,
          status: "active",
        });
      }

      await logAudit("assign_plan", user_id, { plan_id });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return new Response(JSON.stringify({ error: "An error occurred processing your request" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
