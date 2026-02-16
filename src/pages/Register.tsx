import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FileText, Mail, Lock, Eye, EyeOff, ArrowRight, User, Sparkles, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure your passwords match.", variant: "destructive" });
      return;
    }
    if (!agreeTerms) {
      toast({ title: "Terms required", description: "Please agree to the terms and conditions.", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Password must be at least 8 characters long.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await signUp(email, password, fullName);
      if (error) throw error;
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account before logging in.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { value: "2M+", label: "Users" },
    { value: "10M+", label: "CVs Created" },
    { value: "94%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary"><FileText className="h-5 w-5 text-primary-foreground" /></div>
              <span className="font-heading text-2xl font-bold text-primary">CV<span className="text-secondary">COOK</span></span>
            </Link>
          </div>
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">Create Your Account</h2>
            <p className="text-muted-foreground">Start building your professional CV in minutes</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="fullName" type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10 h-12 bg-muted/50 border-border focus:bg-background" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 bg-muted/50 border-border focus:bg-background" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-12 bg-muted/50 border-border focus:bg-background" required minLength={8} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 h-12 bg-muted/50 border-border focus:bg-background" required />
              </div>
            </div>
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(checked as boolean)} className="mt-0.5" />
              <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                I agree to the <Link to="/terms" className="text-secondary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-secondary hover:underline">Privacy Policy</Link>
              </Label>
            </div>
            <Button type="submit" variant="coral" size="lg" className="w-full h-12 mt-2" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2"><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</span>
              ) : (
                <span className="flex items-center gap-2">Create Account<ArrowRight className="h-4 w-4" /></span>
              )}
            </Button>
          </form>
          <p className="text-center mt-6 text-muted-foreground">
            Already have an account? <Link to="/login" className="text-secondary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur"><FileText className="h-5 w-5 text-white" /></div>
            <span className="font-heading text-2xl font-bold text-white">CV<span className="text-secondary">COOK</span></span>
          </Link>
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur mb-6">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm text-white/90">Join 2M+ professionals today</span>
            </div>
            <h1 className="font-heading text-4xl font-bold text-white mb-6">Your Dream Job Starts Here</h1>
            <p className="text-lg text-white/70 mb-8">Create a professional CV that stands out. Our AI-powered builder helps you craft the perfect resume in minutes.</p>
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-heading text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 max-w-md">
            <div className="flex gap-1 mb-3">{[...Array(5)].map((_, i) => (<Star key={i} className="h-5 w-5 fill-secondary text-secondary" />))}</div>
            <p className="text-white/90 italic mb-4">"The easiest CV builder I've ever used. Got 3 interview calls within a week of updating my resume!"</p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" alt="User" className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-semibold text-white text-sm">Michael Chen</div>
                <div className="text-white/60 text-xs">Software Engineer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
