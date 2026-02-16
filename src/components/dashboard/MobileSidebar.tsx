import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSubscription } from "@/hooks/use-subscription";
import {
  FileText, Plus, LayoutGrid, Settings, HelpCircle, Mail, Menu,
  Crown, Zap, CheckCircle2, CreditCard,
} from "lucide-react";
import { useState } from "react";

const MobileSidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { planName, isPro, isPremium, isFreePlan, daysRemaining } = useSubscription();

  const sidebarLinks = [
    { name: "My CVs", icon: FileText, href: "/dashboard" },
    { name: "Cover Letters", icon: Mail, href: "/dashboard/cover-letter" },
    { name: "Templates", icon: LayoutGrid, href: "/dashboard/templates" },
    { name: "Billing", icon: CreditCard, href: "/dashboard/settings?tab=billing" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
    { name: "Help", icon: HelpCircle, href: "/help" },
  ];

  const isActive = (href: string) => location.pathname === href.split("?")[0];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <div className="flex flex-col h-full p-5 gap-6">
          <Link to="/dashboard/create" onClick={() => setOpen(false)}>
            <Button variant="coral" size="lg" className="w-full gap-2 text-sm">
              <Plus className="h-4 w-4" /> Create New CV
            </Button>
          </Link>

          <nav className="space-y-0.5">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Menu</p>
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive(link.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                }`}
              >
                <link.icon className={`h-[18px] w-[18px] ${isActive(link.href) ? "text-primary" : ""}`} />
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-xl border border-secondary/20 bg-gradient-to-br from-secondary/5 via-secondary/10 to-accent/5 p-4">
            {isFreePlan ? (
              <>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-secondary" />
                  <h4 className="font-heading text-sm font-semibold text-foreground">Upgrade to Pro</h4>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">Unlock all templates and AI features.</p>
                <Link to="/pricing" onClick={() => setOpen(false)}>
                  <Button variant="secondary" size="sm" className="mt-3 w-full text-xs">View Plans</Button>
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  {isPremium ? <Crown className="h-4 w-4 text-secondary" /> : <Zap className="h-4 w-4 text-secondary" />}
                  <h4 className="font-heading text-sm font-semibold text-foreground">{planName} Plan</h4>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-secondary">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Active</span>
                  {daysRemaining > 0 && <span className="text-muted-foreground ml-1">· {daysRemaining}d left</span>}
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
