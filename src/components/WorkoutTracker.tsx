import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface Props {
  done: boolean;
  notes: string;
  onToggle: () => void;
  onNotesChange: (notes: string) => void;
}

export function WorkoutTracker({ done, notes, onToggle, onNotesChange }: Props) {
  return (
    <div className={`glass-card p-5 md:p-6 transition-all duration-300 ${done ? "glow-success" : ""}`}>
      <h2 className="text-lg font-semibold text-foreground mb-4">💪 Workout</h2>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={done}
            onCheckedChange={onToggle}
            className={`h-5 w-5 ${done ? "checkbox-bounce" : ""}`}
          />
          <span className={`text-sm font-medium transition-all duration-300 ${done ? "text-success" : "text-foreground"}`}>
            {done ? "Completed! 🎉" : "Not yet"}
          </span>
        </label>
      </div>
      <Input
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Workout notes (exercises, duration...)"
        className="mt-3 bg-input/50 border-glass-border text-sm h-8"
      />
    </div>
  );
}
