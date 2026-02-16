import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FileText, Mail, ArrowRight, ArrowLeft, CheckCircle, KeyRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Email required", description: "Please enter your email address", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      setIsSubmitted(true);
      toast({ title: "Reset link sent!", description: "Check your email for the password reset link." });
    } catch (error) {
      toast({ title: "Failed", description: error instanceof Error ? error.message : "Failed to process request", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col justify-center p-12 w-full">
          <Link to="/" className="flex items-center gap-2 absolute top-12 left-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur"><FileText className="h-5 w-5 text-white" /></div>
            <span className="font-heading text-2xl font-bold text-white">CV<span className="text-secondary">COOK</span></span>
          </Link>
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
              <KeyRound className="h-12 w-12 text-white" />
            </div>
            <h1 className="font-heading text-4xl font-bold text-white mb-6">Secure Password Reset</h1>
            <p className="text-lg text-white/70">We take your account security seriously. A secure reset link will be sent to your email address.</p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary"><FileText className="h-5 w-5 text-primary-foreground" /></div>
              <span className="font-heading text-2xl font-bold text-primary">CV<span className="text-secondary">COOK</span></span>
            </Link>
          </div>
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary/10 flex items-center justify-center"><KeyRound className="h-8 w-8 text-secondary" /></div>
                <h2 className="font-heading text-3xl font-bold text-primary mb-2">Forgot Password?</h2>
                <p className="text-muted-foreground">No worries! Enter your email and we'll send you a reset link.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 bg-muted/50 border-border focus:bg-background" required />
                  </div>
                </div>
                <Button type="submit" variant="coral" size="lg" className="w-full h-12" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2"><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</span>
                  ) : (
                    <span className="flex items-center gap-2">Send Reset Link<ArrowRight className="h-4 w-4" /></span>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center"><CheckCircle className="h-10 w-10 text-accent" /></div>
              <h2 className="font-heading text-3xl font-bold text-primary mb-2">Check Your Email</h2>
              <p className="text-muted-foreground mb-6">We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span></p>
              <div className="bg-muted/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground">Didn't receive the email? Check your spam folder or <button onClick={() => setIsSubmitted(false)} className="text-secondary font-semibold hover:underline">try again</button></p>
              </div>
            </div>
          )}
          <div className="mt-8">
            <Link to="/login" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
              <ArrowLeft className="h-4 w-4" />Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
