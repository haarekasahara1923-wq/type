"use client";

import { useEffect } from "react";
import { useTypingStore } from "@/lib/store";
import TypingBox from "@/components/TypingBox";
import Timer from "@/components/Timer";
import MetricsDisplay from "@/components/MetricsDisplay";
import KeyboardLayout from "@/components/KeyboardLayout";
import ResultCard from "@/components/ResultCard";
import LanguageToggle from "@/components/LanguageToggle";
import { GraduationCap } from "lucide-react";

export default function Home() {
  const { isFinished, setContent } = useTypingStore();

  useEffect(() => {
    // Initial content
    setContent("The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. Accuracy is more important than speed in the beginning.");
  }, [setContent]);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                {process.env.NEXT_PUBLIC_BRAND_NAME?.split(' ')[0] || "E-Max"} <span className="text-brand-primary">{process.env.NEXT_PUBLIC_BRAND_NAME?.split(' ').slice(1).join(' ') || "Typing Lab"}</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Typing Lab & Certification</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <LanguageToggle />
            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Live Exam</span>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {!isFinished ? (
          <div className="space-y-10">
            {/* Top Stats Section */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 w-full">
                <MetricsDisplay />
              </div>
              <div className="w-full lg:w-72">
                <Timer />
              </div>
            </div>

            {/* Main Typing Area */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-orange-400 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
              <TypingBox />
            </div>

            <div className="text-center">
              <p className="text-zinc-400 text-sm italic">
                Tip: Keep your fingers relaxed and look at the screen, not the keyboard.
              </p>
            </div>
          </div>
        ) : (
          <ResultCard />
        )}
      </div>

      <KeyboardLayout />
      
      {/* Footer Branding */}
      <footer className="py-10 text-center border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_BRAND_NAME}. All rights reserved. 
          <span className="mx-2">|</span>
          White-label Typing SaaS Platform
        </p>
      </footer>
    </main>
  );
}
