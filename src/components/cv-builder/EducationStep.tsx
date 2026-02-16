import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Education {
  degree: string;
  school: string;
  year: string;
  gpa?: string;
}

interface EducationStepProps {
  education: Education[];
  onUpdate: (education: Education[]) => void;
}

const EducationStep = ({ education, onUpdate }: EducationStepProps) => {
  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const addEducation = () => {
    onUpdate([...education, { degree: "", school: "", year: "", gpa: "" }]);
  };

  const removeEducation = (index: number) => {
    if (education.length > 1) {
      onUpdate(education.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">Education</h2>
        <p className="text-sm text-muted-foreground">Add your educational background</p>
      </div>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Education {index + 1}
              </span>
              {education.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                  placeholder="Bachelor of Science in Computer Science"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, "degree", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>School</Label>
                <Input
                  placeholder="University of Technology"
                  value={edu.school}
                  onChange={(e) => updateEducation(index, "school", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  placeholder="2016 - 2020"
                  value={edu.year}
                  onChange={(e) => updateEducation(index, "year", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>GPA (Optional)</Label>
                <Input
                  placeholder="3.8/4.0"
                  value={edu.gpa || ""}
                  onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full" onClick={addEducation}>
          + Add Another Education
        </Button>
      </div>
    </div>
  );
};

export default EducationStep;
