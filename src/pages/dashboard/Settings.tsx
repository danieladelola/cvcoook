import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, User, Mail, Phone, MapPin, Bell, Shield, Palette, Camera, Save, Trash2, CreditCard } from "lucide-react";
import BillingTab from "@/components/dashboard/BillingTab";

const Settings = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { user, profile, refreshProfile } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "billing" ? "billing" : "profile";
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security" | "preferences" | "billing">(initialTab as any);

  useEffect(() => { setMounted(true); }, []);

  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
    linkedin: "",
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || "",
        website: profile.website || "",
        linkedin: profile.linkedin || "",
      });
    }
  }, [profile]);

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    cvViews: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  const tabs = [
    { key: "profile" as const, label: "Profile", icon: User },
    { key: "billing" as const, label: "Billing", icon: CreditCard },
    { key: "notifications" as const, label: "Notifications", icon: Bell },
    { key: "security" as const, label: "Security", icon: Shield },
    { key: "preferences" as const, label: "Preferences", icon: Palette },
  ];

  const handleSaveProfile = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("user_id", user.id);
    if (error) {
      toast({ title: "Error", description: "Failed to save profile", variant: "destructive" });
    } else {
      await refreshProfile();
      toast({ title: "Settings saved", description: "Your profile has been updated successfully." });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const newPassword = (form.elements.namedItem("newPassword") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated", description: "Your password has been changed." });
      form.reset();
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      toast({ title: "Invalid file type", description: "Only JPG, PNG, GIF, and WebP images are allowed.", variant: "destructive" });
      return;
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Only JPG, PNG, GIF, and WebP images are allowed.", variant: "destructive" });
      return;
    }

    // Validate file size (1MB max)
    if (file.size > 1024 * 1024) {
      toast({ title: "File too large", description: "Avatar must be under 1MB.", variant: "destructive" });
      return;
    }

    const filePath = `${user.id}/avatar.${extension}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
    if (uploadError) {
      toast({ title: "Upload failed", description: "Could not upload avatar. Please try again.", variant: "destructive" });
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("user_id", user.id);
    await refreshProfile();
    toast({ title: "Avatar updated!" });
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header variant="dashboard" />
      <div className="container max-w-5xl py-8">
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4" />Back to Dashboard
        </Link>
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">Account Settings</h1>
          <p className="mt-1 text-muted-foreground">Manage your profile and preferences</p>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-64">
            <nav className="flex gap-2 lg:flex-col">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                    <TabIcon className="h-5 w-5" /><span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex-1 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            {activeTab === "profile" && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-xl font-semibold text-foreground">Profile Information</h2><p className="text-sm text-muted-foreground">Update your personal details</p></div>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="h-24 w-24 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-3xl font-bold text-white">{initials}</div>
                    )}
                    <label className="absolute bottom-0 right-0 rounded-full border-2 border-card bg-primary p-2 text-primary-foreground hover:bg-primary/90 cursor-pointer">
                      <Camera className="h-4 w-4" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </label>
                  </div>
                  <div><p className="font-medium text-foreground">Profile Photo</p><p className="text-sm text-muted-foreground">JPG, GIF or PNG. 1MB max.</p></div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <div className="relative"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-10" value={profileData.full_name} onChange={(e) => setProfileData(p => ({ ...p, full_name: e.target.value }))} /></div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-10" value={user?.email || ""} disabled /></div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <div className="relative"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-10" value={profileData.phone} onChange={(e) => setProfileData(p => ({ ...p, phone: e.target.value }))} /></div>
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <div className="relative"><MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-10" value={profileData.location} onChange={(e) => setProfileData(p => ({ ...p, location: e.target.value }))} /></div>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Bio</Label>
                    <Textarea rows={4} value={profileData.bio} onChange={(e) => setProfileData(p => ({ ...p, bio: e.target.value }))} />
                  </div>
                </div>
                <div className="flex justify-end"><Button variant="coral" onClick={handleSaveProfile} className="gap-2"><Save className="h-4 w-4" />Save Changes</Button></div>
              </div>
            )}
            {activeTab === "notifications" && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-xl font-semibold text-foreground">Notification Preferences</h2></div>
                <div className="space-y-6">
                  {[
                    { key: "emailUpdates", label: "Email Updates", desc: "Receive updates about new features" },
                    { key: "cvViews", label: "CV View Alerts", desc: "Get notified when someone views your CV" },
                    { key: "weeklyDigest", label: "Weekly Digest", desc: "Weekly summary of CV performance" },
                    { key: "marketingEmails", label: "Marketing Emails", desc: "Tips, promotions, and career advice" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div><p className="font-medium text-foreground">{item.label}</p><p className="text-sm text-muted-foreground">{item.desc}</p></div>
                      <Switch checked={notifications[item.key as keyof typeof notifications]} onCheckedChange={(checked) => setNotifications(n => ({ ...n, [item.key]: checked }))} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "security" && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-xl font-semibold text-foreground">Security Settings</h2></div>
                <form onSubmit={handleUpdatePassword} className="rounded-lg border border-border p-6 space-y-4">
                  <h3 className="font-medium text-foreground">Change Password</h3>
                  <div className="space-y-2"><Label htmlFor="newPassword">New Password</Label><Input id="newPassword" name="newPassword" type="password" minLength={8} required /></div>
                  <div className="space-y-2"><Label htmlFor="confirmPassword">Confirm New Password</Label><Input id="confirmPassword" name="confirmPassword" type="password" required /></div>
                  <Button variant="secondary" type="submit">Update Password</Button>
                </form>
              </div>
            )}
            {activeTab === "billing" && <BillingTab />}
            {activeTab === "preferences" && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-xl font-semibold text-foreground">App Preferences</h2></div>
                <div className="rounded-lg border border-border p-6">
                  <h3 className="font-medium text-foreground">Theme</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Select your preferred theme</p>
                  <div className="flex gap-3">
                    {[
                      { val: "light", emoji: "☀️", label: "Light", bg: "bg-white" },
                      { val: "dark", emoji: "🌙", label: "Dark", bg: "bg-slate-800" },
                      { val: "system", emoji: "⚙️", label: "Auto", bg: "bg-gradient-to-b from-white to-slate-800" },
                    ].map((t) => (
                      <button key={t.val} onClick={() => setTheme(t.val)}
                        className={`flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-lg border-2 transition-all ${mounted && theme === t.val ? "border-primary shadow-md" : "border-border hover:border-primary/50"} ${t.bg}`}>
                        <span className="text-2xl">{t.emoji}</span>
                        <span className="text-xs text-muted-foreground">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
