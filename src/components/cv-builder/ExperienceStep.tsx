import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface ExperienceStepProps {
  experiences: Experience[];
  onUpdate: (experiences: Experience[]) => void;
}

const ExperienceStep = ({ experiences, onUpdate }: ExperienceStepProps) => {

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const addExperience = () => {
    onUpdate([...experiences, { title: "", company: "", duration: "", description: "" }]);
  };

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      onUpdate(experiences.filter((_, i) => i !== index));
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Work Experience
        </h2>
        <p className="text-sm text-muted-foreground">
          Add your relevant work history
        </p>
      </div>
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div key={index} className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Experience {index + 1}
              </span>
              {experiences.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  placeholder="Software Engineer"
                  value={exp.title}
                  onChange={(e) => updateExperience(index, "title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  placeholder="Tech Company Inc."
                  value={exp.company}
                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Duration</Label>
                <Input
                  placeholder="Jan 2020 - Present"
                  value={exp.duration}
                  onChange={(e) => updateExperience(index, "duration", e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                  value={exp.description}
                  onChange={(e) => updateExperience(index, "description", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full" onClick={addExperience}>
          + Add Another Experience
        </Button>
      </div>
    </div>
  );
};

export default ExperienceStep;
