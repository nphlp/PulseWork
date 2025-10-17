"use client";

import TimeInput from "@comps/SHADCN/components/time-input";
import { useDebugTimeQueryParams } from "@comps/SHARED/filters/queryParamsClientHooks";
import { Time } from "@internationalized/date";
import { Label } from "@shadcn/ui/label";

export function TimeDebugger() {
    const { debugTime, setDebugTime } = useDebugTimeQueryParams();

    // Convert string "HH:MM" to Time object
    const timeValue = debugTime
        ? (() => {
              const [hours, minutes] = debugTime.split(":").map(Number);
              return new Time(hours, minutes);
          })()
        : null;

    // Convert Time object to string "HH:MM"
    const handleTimeChange = (time: Time | null) => {
        if (time) {
            const hours = time.hour.toString().padStart(2, "0");
            const minutes = time.minute.toString().padStart(2, "0");
            setDebugTime(`${hours}:${minutes}`);
        } else {
            setDebugTime(null);
        }
    };

    // Only show in development
    if (process.env.NODE_ENV !== "development") {
        return null;
    }

    return (
        <div>
            <Label htmlFor="debug-time">Debuggage heure</Label>
            <TimeInput time={timeValue} setTime={handleTimeChange} />
        </div>
    );
}
