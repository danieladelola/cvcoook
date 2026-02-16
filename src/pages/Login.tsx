import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FileText, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Missing fields", description: "Please enter both email and password", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      toast({ title: "Welcome back!", description: "You have successfully logged in." });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    "Access 100+ professional templates",
    "AI-powered content suggestions",
    "ATS-optimized formatting",
    "Unlimited downloads"
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-2xl font-bold text-white">CV<span className="text-secondary">COOK</span></span>
          </Link>
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur mb-6">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm text-white/90">Trusted by 2M+ professionals</span>
            </div>
            <h1 className="font-heading text-4xl font-bold text-white mb-6">Build Your Career with the Perfect CV</h1>
            <p className="text-lg text-white/70 mb-8">Join millions of job seekers who have landed their dream jobs with our AI-powered CV builder.</p>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 max-w-md">
            <p className="text-white/90 italic mb-4">"CVCOOK helped me land my dream job at a Fortune 500 company. The AI suggestions were incredibly helpful!"</p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face" alt="User" className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-semibold text-white text-sm">Sarah Johnson</div>
                <div className="text-white/60 text-xs">Marketing Director</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-2xl font-bold text-primary">CV<span className="text-secondary">COOK</span></span>
            </Link>
          </div>
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 bg-muted/50 border-border focus:bg-background" required />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Link to="/forgot-password" className="text-sm text-secondary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-12 bg-muted/50 border-border focus:bg-background" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Remember me for 30 days</Label>
            </div>
            <Button type="submit" variant="coral" size="lg" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2"><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span>
              ) : (
                <span className="flex items-center gap-2">Sign In<ArrowRight className="h-4 w-4" /></span>
              )}
            </Button>
          </form>
          <p className="text-center mt-8 text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-secondary font-semibold hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
