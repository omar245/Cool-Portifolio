import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  prayers: Record<string, boolean>;
  onToggle: (prayer: string) => void;
  done: number;
  total: number;
}

const PRAYER_TIMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_EMOJI: Record<string, string> = {
  Fajr: "🌅",
  Dhuhr: "☀️",
  Asr: "🌤️",
  Maghrib: "🌇",
  Isha: "🌙",
};

export function PrayerTracker({ prayers, onToggle, done, total }: Props) {
  return (
    <div className="glass-card p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">🕌 Prayer Tracker</h2>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-success/20 text-success">
          {done}/{total}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {PRAYER_TIMES.map((prayer) => (
          <label
            key={prayer}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-secondary/50 ${
              prayers[prayer] ? "glow-success bg-success/10" : ""
            }`}
          >
            <span className="text-xl">{PRAYER_EMOJI[prayer]}</span>
            <Checkbox
              checked={prayers[prayer] || false}
              onCheckedChange={() => onToggle(prayer)}
              className={`h-5 w-5 ${prayers[prayer] ? "checkbox-bounce" : ""}`}
            />
            <span className={`text-xs font-medium transition-all duration-300 ${prayers[prayer] ? "text-success" : "text-muted-foreground"}`}>
              {prayer}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
