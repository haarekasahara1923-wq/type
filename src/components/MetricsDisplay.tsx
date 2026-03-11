"use client";

import { useTypingStore } from "@/lib/store";
import { Gauge, Target, AlertCircle, Zap } from "lucide-react";

export default function MetricsDisplay() {
  const { wpm, accuracy, errors, cpm } = useTypingStore();

  const metrics = [
    { label: "WPM", value: wpm, icon: Gauge, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20" },
    { label: "Accuracy", value: `${accuracy}%`, icon: Target, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/20" },
    { label: "Errors", value: errors, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/20" },
    { label: "CPM", value: cpm, icon: Zap, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/20" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div 
          key={m.label} 
          className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-xl ${m.bg}`}>
              <m.icon className={m.color} size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-1 font-mono">
            {m.value}
          </div>
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}
