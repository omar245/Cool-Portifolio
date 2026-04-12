import { useState, useEffect } from "react";

export function LiveClock() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    function update() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass-card p-6 md:p-8 text-center">
      <p className="text-4xl md:text-6xl font-bold tracking-tight text-foreground tabular-nums">
        {time || "00:00:00 AM"}
      </p>
      <p className="mt-2 text-sm md:text-base text-muted-foreground">{date || "Loading..."}</p>
    </div>
  );
}
