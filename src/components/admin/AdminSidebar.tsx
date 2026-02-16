import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const sidebarLinks: Array<{
  name: string;
  icon: any;
  href: string;
  roles?: string[];
}> = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Templates", icon: LayoutGrid, href: "/admin/templates" },
  { name: "Analytics", icon: BarChart3, href: "/admin/analytics", roles: ["admin"] },
  { name: "Settings", icon: Settings, href: "/admin/settings", roles: ["admin"] },
  { name: "Support", icon: HelpCircle, href: "/admin/support" },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  badges?: Record<string, number>;
}

export default function AdminSidebar({ collapsed, onToggle, badges }: AdminSidebarProps) {
  const location = useLocation();
  const { signOut, user } = useAuth() as any;

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
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
            onClick={onToggle}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            aria-label={collapsed ? "Open admin sidebar" : "Collapse admin sidebar"}
            aria-expanded={!collapsed}
            aria-controls="admin-sidebar"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
        <nav
          id="admin-sidebar"
          role="navigation"
          aria-label="Admin sidebar"
          className="flex-1 space-y-1 p-4"
        >
          {sidebarLinks
            .filter((link) => !link.roles || (user && link.roles.includes(user?.role)))
            .map((link) => {
              const isActive =
                location.pathname === link.href || location.pathname.startsWith(link.href + "/") || location.pathname.startsWith(link.href);
              const badgeCount = badges?.[link.href];
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="relative">
                    <link.icon className="h-5 w-5 shrink-0" />
                    {badgeCount ? (
                      <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-medium text-white">
                        {badgeCount}
                      </span>
                    ) : null}
                  </div>
                  {!collapsed && <span>{link.name}</span>}
                </Link>
              );
            })}
        </nav>

        <div className="border-t border-border p-4">
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
