import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileText, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, user, isAdmin } = useAuth();

  // If already logged in as admin, redirect
  if (user && isAdmin) {
    navigate("/admin/dashboard", { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      // After sign in, auth context will update isAdmin
      // We need to wait for the context to update
      toast({ title: "Checking admin access...", description: "Verifying your role..." });
      // Small delay to allow auth context to update
      setTimeout(async () => {
        // Re-check admin status from the database
        const { supabase } = await import("@/integrations/supabase/client");
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", sessionData.session.user.id)
            .eq("role", "admin")
            .maybeSingle();
          
          if (roleData) {
            toast({ title: "Welcome back, Admin!", description: "Redirecting to dashboard..." });
            navigate("/admin/dashboard");
          } else {
            toast({ title: "Access denied", description: "You don't have admin privileges.", variant: "destructive" });
            await supabase.auth.signOut();
          }
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({ title: "Login failed", description: error instanceof Error ? error.message : "Please check your credentials.", variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary"><FileText className="h-6 w-6 text-primary-foreground" /></div>
            <span className="font-heading text-2xl font-bold text-primary">CV<span className="text-secondary">COOK</span></span>
          </Link>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
            <Shield className="h-4 w-4" />Admin Portal
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Admin Login</h1>
          <p className="mt-2 text-muted-foreground">Access the administration dashboard</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="admin@cvcook.com" className="h-12 pl-11" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="h-12 pl-11 pr-11" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="coral" size="xl" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In to Admin"}
            </Button>
          </form>
          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">← Back to User Login</Link>
          </div>
        </div>
      </div>
      <div className="hidden w-1/2 flex-col justify-center bg-gradient-to-br from-primary via-primary/90 to-secondary p-16 lg:flex">
        <div className="max-w-lg">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
            <Shield className="h-4 w-4" />Secure Admin Access
          </div>
          <h2 className="font-heading text-4xl font-bold text-white">Control Center</h2>
          <p className="mt-4 text-lg text-white/80">Manage users, templates, analytics, and all platform settings from your admin dashboard.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
