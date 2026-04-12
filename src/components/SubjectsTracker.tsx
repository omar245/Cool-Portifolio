import { Input } from "@/components/ui/input";
import { BookOpen, FlaskConical, Languages, Calculator, PenLine, Clock } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  subjects: Record<string, string>;
  onUpdate: (subject: string, value: string) => void;
  filled: number;
  total: number;
}

const ICONS: Record<string, ReactNode> = {
  Physics: <FlaskConical className="h-4 w-4 text-chart-1" />,
  Chemistry: <FlaskConical className="h-4 w-4 text-chart-2" />,
  Arabic: <Languages className="h-4 w-4 text-chart-3" />,
  Math: <Calculator className="h-4 w-4 text-chart-4" />,
  English: <PenLine className="h-4 w-4 text-accent" />,
  History: <Clock className="h-4 w-4 text-chart-5" />,
};

export function SubjectsTracker({ subjects, onUpdate, filled, total }: Props) {
  return (
    <div className="glass-card p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">📚 Subjects</h2>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/20 text-accent">
          {filled}/{total}
        </span>
      </div>
      <div className="space-y-3">
        {Object.entries(subjects).map(([name, value]) => (
          <div key={name} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${value.trim() ? "glow-success bg-success/5" : "hover:bg-secondary/50"}`}>
            <div className="flex items-center gap-2 min-w-[100px]">
              {ICONS[name] || <BookOpen className="h-4 w-4 text-muted-foreground" />}
              <span className="text-sm font-medium text-foreground">{name}</span>
            </div>
            <Input
              value={value}
              onChange={(e) => onUpdate(name, e.target.value)}
              placeholder="What did you complete?"
              className="bg-input/50 border-glass-border text-sm h-8"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
