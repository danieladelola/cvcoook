import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Menu, X, User, Settings, LogOut, CreditCard, HelpCircle, LayoutGrid } from "lucide-react";
import { useState } from "react";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  variant?: "default" | "dashboard";
}

const Header = ({ variant = "default" }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() || "?";

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const dashboardLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My CVs", href: "/dashboard" },
    { name: "Templates", href: "/dashboard/templates" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to={variant === "dashboard" ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-primary">CV<span className="text-secondary">COOK</span></span>
        </Link>

        {variant === "dashboard" ? (
          <nav className="hidden items-center gap-8 md:flex">
            {dashboardLinks.map((link) => (
              <Link key={link.name} to={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">{link.name}</Link>
            ))}
          </nav>
        ) : (
          <MegaMenu />
        )}

        <div className="hidden items-center gap-3 lg:flex">
          {variant === "dashboard" || user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-full p-1 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-medium">{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border border-border shadow-lg z-50">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer"><LayoutGrid className="h-4 w-4" /><span>Dashboard</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings" className="flex items-center gap-2 cursor-pointer"><User className="h-4 w-4" /><span>Profile</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings" className="flex items-center gap-2 cursor-pointer"><Settings className="h-4 w-4" /><span>Settings</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/pricing" className="flex items-center gap-2 cursor-pointer"><CreditCard className="h-4 w-4" /><span>Billing</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/help" className="flex items-center gap-2 cursor-pointer"><HelpCircle className="h-4 w-4" /><span>Help & Support</span></Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" /><span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : isAuthPage ? (
            <Link to="/"><Button variant="coral" size="lg">Start Now</Button></Link>
          ) : (
            <>
              <Link to="/login"><Button variant="navOutline" size="default">Login</Button></Link>
              <Link to="/register"><Button variant="coral" size="default">Start Now</Button></Link>
            </>
          )}
        </div>

        <button className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {mobileMenuOpen && <MobileMenu variant={variant} onClose={() => setMobileMenuOpen(false)} />}
    </header>
  );
};

export default Header;
