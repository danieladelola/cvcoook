import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Globe, Mail, Shield, Database, Save, Eye, EyeOff, Check, Loader2,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

// --- Settings tabs ---

interface SaveProps { onSave: (key: string, value: Record<string, unknown>) => Promise<void>; loading: boolean; settings: Record<string, unknown>; }

const GeneralTab = ({ onSave, loading, settings }: SaveProps) => {
  const [form, setForm] = useState({
    site_name: (settings.site_name as string) || "CVCOOK",
    site_url: (settings.site_url as string) || "",
    site_description: (settings.site_description as string) || "",
    default_language: (settings.default_language as string) || "English",
    timezone: (settings.timezone as string) || "UTC",
    maintenance_mode: (settings.maintenance_mode as boolean) || false,
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">General Settings</h2>
        <p className="text-sm text-muted-foreground">Configure your platform's basic settings</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2"><Label>Site Name</Label><Input value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} /></div>
        <div className="space-y-2"><Label>Site URL</Label><Input value={form.site_url} onChange={(e) => setForm({ ...form, site_url: e.target.value })} /></div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Site Description</Label>
          <Textarea rows={3} value={form.site_description} onChange={(e) => setForm({ ...form, site_description: e.target.value })} />
        </div>
        <div className="space-y-2"><Label>Default Language</Label><Input value={form.default_language} onChange={(e) => setForm({ ...form, default_language: e.target.value })} /></div>
        <div className="space-y-2"><Label>Timezone</Label><Input value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} /></div>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div>
          <p className="font-medium text-foreground">Maintenance Mode</p>
          <p className="text-sm text-muted-foreground">Temporarily disable the site</p>
        </div>
        <Switch checked={form.maintenance_mode} onCheckedChange={(v) => setForm({ ...form, maintenance_mode: v })} />
      </div>
      <div className="flex justify-end">
        <Button variant="default" onClick={() => onSave("general_settings", form)} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Changes
        </Button>
      </div>
    </div>
  );
};

const SecurityTab = ({ onSave, loading, settings }: SaveProps) => {
  const [form, setForm] = useState({
    two_factor: (settings.two_factor as boolean) ?? true,
    force_https: (settings.force_https as boolean) ?? true,
    rate_limiting: (settings.rate_limiting as boolean) ?? true,
    session_timeout: (settings.session_timeout as string) || "30 min",
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">Security Settings</h2>
        <p className="text-sm text-muted-foreground">Configure security and authentication</p>
      </div>
      <div className="space-y-6">
        {[
          { key: "two_factor", title: "Two-Factor Authentication", desc: "Require 2FA for admin accounts" },
          { key: "force_https", title: "Force HTTPS", desc: "Redirect all traffic to HTTPS" },
          { key: "rate_limiting", title: "Login Rate Limiting", desc: "Limit failed login attempts" },
        ].map((s) => (
          <div key={s.key} className="flex items-center justify-between rounded-lg border border-border p-4">
            <div><p className="font-medium text-foreground">{s.title}</p><p className="text-sm text-muted-foreground">{s.desc}</p></div>
            <Switch checked={(form as any)[s.key]} onCheckedChange={(v) => setForm({ ...form, [s.key]: v })} />
          </div>
        ))}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div><p className="font-medium text-foreground">Session Timeout</p><p className="text-sm text-muted-foreground">Auto logout after inactivity</p></div>
          <Input className="w-24" value={form.session_timeout} onChange={(e) => setForm({ ...form, session_timeout: e.target.value })} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="default" onClick={() => onSave("security_settings", form)} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Changes
        </Button>
      </div>
    </div>
  );
};

// --- Integrations Tab ---

interface GatewayConfig { secret_key: string; public_key: string; enabled: boolean; }
const emptyGateway: GatewayConfig = { secret_key: "", public_key: "", enabled: false };

const IntegrationsTab = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});
  const [paystack, setPaystack] = useState<GatewayConfig>({ ...emptyGateway });

  useEffect(() => { loadCredentials(); }, []);

  const loadCredentials = async () => {
    setLoading(true);
    const { data } = await supabase.from("site_settings").select("key, value").in("key", ["paystack_config"]);
    if (data) {
      for (const row of data) {
        const val = row.value as unknown as GatewayConfig;
        if (row.key === "paystack_config" && val) setPaystack({ ...emptyGateway, ...val });
      }
    }
    setLoading(false);
  };

  const saveGateway = async (key: string, config: GatewayConfig) => {
    setSaving(key);
    const { data: existing } = await supabase.from("site_settings").select("id").eq("key", key).maybeSingle();
    const jsonValue = JSON.parse(JSON.stringify(config));
    let error;
    if (existing) {
      const result = await supabase.from("site_settings").update({ value: jsonValue, updated_at: new Date().toISOString() }).eq("key", key);
      error = result.error;
    } else {
      const result = await supabase.from("site_settings").insert([{ key, value: jsonValue }]);
      error = result.error;
    }
    if (error) toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    else toast({ title: "Saved", description: "Paystack credentials saved." });
    setSaving(null);
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">Payment Integrations</h2>
        <p className="text-sm text-muted-foreground">Manage your payment gateway credentials</p>
      </div>
      <div className="rounded-lg border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <span className="text-lg font-bold text-secondary">P</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Paystack</p>
              <p className="text-sm text-muted-foreground">Payment gateway</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={paystack.enabled} onCheckedChange={(v) => setPaystack({ ...paystack, enabled: v })} />
            {paystack.enabled && paystack.secret_key.length > 0 && <span className="flex items-center gap-1 text-xs font-medium text-secondary"><Check className="h-3 w-3" />Connected</span>}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Public Key</Label>
            <Input placeholder="Paystack public key" value={paystack.public_key} onChange={(e) => setPaystack({ ...paystack, public_key: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Secret Key</Label>
            <div className="relative">
              <Input type={showSecret["paystack"] ? "text" : "password"} placeholder="Paystack secret key" value={paystack.secret_key} onChange={(e) => setPaystack({ ...paystack, secret_key: e.target.value })} className="pr-10" />
              <button type="button" onClick={() => setShowSecret((p) => ({ ...p, paystack: !p.paystack }))} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showSecret["paystack"] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="default" size="sm" disabled={saving === "paystack_config"} onClick={() => saveGateway("paystack_config", paystack)} className="gap-2">
            {saving === "paystack_config" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Paystack
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Main Settings Page ---

const settingsTabs = [
  { key: "general" as const, label: "General", icon: Globe },
  { key: "security" as const, label: "Security", icon: Shield },
  { key: "integrations" as const, label: "Integrations", icon: Database },
];

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState<"general" | "security" | "integrations">("general");
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, Record<string, unknown>>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadAllSettings();
  }, []);

  const loadAllSettings = async () => {
    const { data } = await supabase.from("site_settings").select("key, value").in("key", ["general_settings", "security_settings"]);
    if (data) {
      const map: Record<string, Record<string, unknown>> = {};
      data.forEach((row) => { map[row.key] = row.value as Record<string, unknown>; });
      setSettings(map);
    }
  };

  const handleSave = async (key: string, value: Record<string, unknown>) => {
    setSaving(true);
    const { data: existing } = await supabase.from("site_settings").select("id").eq("key", key).maybeSingle();
    const jsonValue = JSON.parse(JSON.stringify(value));
    let error;
    if (existing) {
      const result = await supabase.from("site_settings").update({ value: jsonValue, updated_at: new Date().toISOString() }).eq("key", key);
      error = result.error;
    } else {
      const result = await supabase.from("site_settings").insert([{ key, value: jsonValue }]);
      error = result.error;
    }
    if (error) toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    else toast({ title: "Settings saved", description: "Your changes have been saved successfully." });
    setSaving(false);
  };

  return (
    <AdminLayout title="System Settings">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-56">
          <nav className="flex gap-2 lg:flex-col">
            {settingsTabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  <TabIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="flex-1 rounded-xl border border-border bg-card p-6">
          {activeTab === "general" && <GeneralTab onSave={handleSave} loading={saving} settings={settings.general_settings || {}} />}
          {activeTab === "security" && <SecurityTab onSave={handleSave} loading={saving} settings={settings.security_settings || {}} />}
          {activeTab === "integrations" && <IntegrationsTab />}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
