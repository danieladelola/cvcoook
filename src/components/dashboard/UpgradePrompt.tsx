import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";

interface UpgradePromptProps {
  feature: string;
  description?: string;
}

const UpgradePrompt = ({ feature, description }: UpgradePromptProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-secondary/30 bg-gradient-to-br from-secondary/5 to-accent/5 p-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 mb-4">
        <Lock className="h-8 w-8 text-secondary" />
      </div>
      <h3 className="font-heading text-xl font-bold text-foreground mb-2">
        Upgrade to Unlock {feature}
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {description || `This feature is available on Pro and Premium plans. Upgrade now to access ${feature.toLowerCase()} and more.`}
      </p>
      <Link to="/pricing">
        <Button variant="coral" size="lg" className="gap-2">
          <Crown className="h-4 w-4" /> View Plans & Upgrade
        </Button>
      </Link>
    </div>
  );
};

export default UpgradePrompt;
