import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experiences?: { title: string; company: string; duration: string; description: string }[];
  skills?: { technical: string; soft: string; languages: string };
}

interface PersonalInfoStepProps {
  formData: FormData;
  onUpdate: (field: string, value: string) => void;
}

const PersonalInfoStep = ({ formData, onUpdate }: PersonalInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Personal Information
        </h2>
        <p className="text-sm text-muted-foreground">
          Let employers know how to reach you
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => onUpdate("fullName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => onUpdate("email", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="+1 234 567 8900"
            value={formData.phone}
            onChange={(e) => onUpdate("phone", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="New York, NY"
            value={formData.location}
            onChange={(e) => onUpdate("location", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          placeholder="A brief summary of your professional background..."
          rows={4}
          value={formData.summary}
          onChange={(e) => onUpdate("summary", e.target.value)}
        />
      </div>
    </div>
  );
};

export default PersonalInfoStep;
