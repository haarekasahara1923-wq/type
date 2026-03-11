"use client";

import { useState } from "react";
import { 
  Users, 
  FileText, 
  Settings, 
  LayoutDashboard, 
  PlusCircle, 
  Download,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const sidebarItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Manage Students", icon: Users },
    { id: "paragraphs", label: "Typing Paragraphs", icon: FileText },
    { id: "branding", label: "Institute Branding", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-brand-primary rounded-lg" />
          <h2 className="font-bold text-lg">Admin Panel</h2>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm",
                activeTab === item.id 
                  ? "bg-brand-primary/10 text-brand-primary" 
                  : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold capitalize">{activeTab}</h1>
              <p className="text-zinc-500">Manage your institute and students here.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-bold shadow-sm">
                <Download size={16} />
                Export CSV
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white text-sm font-bold shadow-lg shadow-orange-500/20">
                <PlusCircle size={16} />
                Add Student
              </button>
            </div>
          </header>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[500px]">
            {activeTab === "overview" && (
              <div className="p-8">
                <div className="grid grid-cols-3 gap-6 mb-10">
                  <StatCard label="Total Students" value="124" />
                  <StatCard label="Avg. WPM" value="42.5" />
                  <StatCard label="Tests Completed" value="1,892" />
                </div>
                
                <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                        <div>
                          <p className="font-bold">Student Name #{i}</p>
                          <p className="text-xs text-zinc-500">English Typing Test • 2 mins ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-brand-primary">45 WPM</p>
                        <p className="text-[10px] uppercase font-bold text-zinc-400">98% Acc</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="text-3xl font-black">{value}</div>
    </div>
  );
}
