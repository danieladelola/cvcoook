import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SkillsData {
  technical: string;
  soft: string;
  languages: string;
}

interface SkillsStepProps {
  skills: SkillsData;
  onUpdate: (skills: SkillsData) => void;
  experiences?: { title: string; company: string; duration: string; description: string }[];
}

const SkillsStep = ({ skills, onUpdate, experiences }: SkillsStepProps) => {
  const updateSkill = (field: keyof SkillsData, value: string) => {
    onUpdate({ ...skills, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">Skills</h2>
        <p className="text-sm text-muted-foreground">Highlight your key skills and competencies</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Technical Skills</Label>
          <Textarea
            placeholder="JavaScript, React, Node.js, Python, SQL..."
            rows={3}
            value={skills.technical}
            onChange={(e) => updateSkill("technical", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Soft Skills</Label>
          <Textarea
            placeholder="Leadership, Communication, Problem-solving..."
            rows={3}
            value={skills.soft}
            onChange={(e) => updateSkill("soft", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Languages</Label>
          <Input
            placeholder="English (Native), Spanish (Fluent)"
            value={skills.languages}
            onChange={(e) => updateSkill("languages", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SkillsStep;
