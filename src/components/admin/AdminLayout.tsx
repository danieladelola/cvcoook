import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  LayoutDashboard,
  Users,
  LayoutGrid,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  ClipboardList,
  CreditCard,
  Mail,
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "CVs", icon: FileText, href: "/admin/cvs" },
  { name: "Cover Letters", icon: Mail, href: "/admin/cover-letters" },
  { name: "Templates", icon: LayoutGrid, href: "/admin/templates" },
  { name: "Payments", icon: CreditCard, href: "/admin/payments" },
  { name: "Audit Log", icon: ClipboardList, href: "/admin/audit-log" },
  { name: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { name: "Support", icon: HelpCircle, href: "/admin/support" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AdminLayout({ title, children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            {!sidebarCollapsed && (
              <Link to="/admin/dashboard" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-heading text-xl font-bold text-primary">
                  CV<span className="text-secondary">COOK</span>
                </span>
              </Link>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  title={sidebarCollapsed ? link.name : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <link.icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && <span>{link.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-border p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <h1 className="font-heading text-xl font-bold text-foreground">{title}</h1>
          <div className="flex items-center gap-4">
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-bold text-white text-sm">
              {(profile?.full_name || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
