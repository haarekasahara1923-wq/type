"use client";

import { useEffect, useState } from "react";
import { useTypingStore } from "@/lib/store";
import TypingBox from "@/components/TypingBox";
import Timer from "@/components/Timer";
import MetricsDisplay from "@/components/MetricsDisplay";
import KeyboardLayout from "@/components/KeyboardLayout";
import ResultCard from "@/components/ResultCard";
import LanguageToggle from "@/components/LanguageToggle";
import { GraduationCap, Loader2 } from "lucide-react";

export default function Home() {
  const { isFinished, setContent, language } = useTypingStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/paragraphs?language=${language}`);
        const data = await res.json();
        
        if (data && data.length > 0) {
          // Pick a random paragraph
          const randomIndex = Math.floor(Math.random() * data.length);
          setContent(data[randomIndex].content);
        } else {
          // Fallback if no data in DB
          const fallback = language === 'English' 
            ? "The quick brown fox jumps over the lazy dog. Accuracy is more important than speed."
            : "नमस्ते भारत। यह हिंदी टाइपिंग अभ्यास है। अपनी गति बढ़ाएं।";
          setContent(fallback);
        }
      } catch (error) {
        console.error("Failed to fetch content", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [language, setContent]);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-brand-primary selection:text-white">
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
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Live Exam</span>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[500px] gap-4">
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Preparing Examination...</p>
          </div>
        ) : !isFinished ? (
          <div className="space-y-10 animate-in fade-in duration-700">
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
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-orange-400 rounded-[32px] blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>
              <TypingBox />
            </div>

            <div className="text-center">
              <p className="text-zinc-400 text-sm italic py-4 border-y border-zinc-100 dark:border-zinc-800 inline-block px-10">
                Tip: Keep your fingers relaxed and look at the screen, not the keyboard.
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-500">
            <ResultCard />
          </div>
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

