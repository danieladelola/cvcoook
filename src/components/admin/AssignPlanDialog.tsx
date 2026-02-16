import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Plan {
  id: string;
  name: string;
  price_monthly: number;
}

interface AssignPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  loading: boolean;
  onSubmit: (planId: string) => void;
}

export default function AssignPlanDialog({
  open,
  onOpenChange,
  userName,
  loading,
  onSubmit,
}: AssignPlanDialogProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("");

  useEffect(() => {
    if (open) {
      supabase
        .from("plans")
        .select("id, name, price_monthly")
        .eq("is_active", true)
        .order("sort_order")
        .then(({ data }) => {
          if (data) setPlans(data);
        });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlan) onSubmit(selectedPlan);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Assign Plan</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Assign a subscription plan to <strong>{userName}</strong>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Plan</Label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} — ${plan.price_monthly}/mo
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !selectedPlan}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
