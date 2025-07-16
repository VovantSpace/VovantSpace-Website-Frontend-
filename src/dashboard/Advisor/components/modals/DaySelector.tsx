import { cn } from "@/dashboard/Innovator/lib/utils"

interface DaySelectorProps {
  days: {
    name: string
    date: number
    isSelected?: boolean
    isToday?: boolean
  }[]
  onSelectDay: (index: number) => void
}

export function DaySelector({ days, onSelectDay }: DaySelectorProps) {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {days.map((day) => {
        const isSelected = day.isSelected;
        const isToday = day.isToday && !isSelected;

        return (
          <button
            key={day.date} 
            onClick={() => onSelectDay(day.date)}
            aria-pressed={isSelected}
            className={cn(
              "flex min-w-[60px] flex-col items-center rounded-md border p-3 transition-colors",
              isSelected
                ? "border-green-800 bg-green-800 text-white"
                : "border",
              isToday && ""
            )}
          >
            <span className="text-xs font-medium">{day.name}</span>
            <span className="text-lg font-bold">{day.date}</span>
          </button>
        );
      })}
    </div>
  );
}
