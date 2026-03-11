"use client";

import { useTypingStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function LanguageToggle() {
  const { language, setLanguage, setContent } = useTypingStore();

  const handleToggle = (lang: 'English' | 'Hindi') => {
    setLanguage(lang);
    // When language changes, we usually fetch a new paragraph.
    // For now, let's just set a placeholder or reset.
    if (lang === 'Hindi') {
      setContent("नमस्ते भारत। यह हिंदी टाइपिंग अभ्यास है। आप अपनी टाइपिंग गति सुधार सकते हैं।");
    } else {
      setContent("The quick brown fox jumps over the lazy dog. Typing is an essential skill in the modern world.");
    }
  };

  return (
    <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-700">
      <button 
        onClick={() => handleToggle('English')}
        className={cn(
          "px-6 py-2 rounded-xl text-sm font-bold transition-all",
          language === 'English' 
            ? "bg-white dark:bg-zinc-700 text-brand-primary shadow-sm" 
            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        )}
      >
        English
      </button>
      <button 
        onClick={() => handleToggle('Hindi')}
        className={cn(
          "px-6 py-2 rounded-xl text-sm font-bold transition-all font-hindi",
          language === 'Hindi' 
            ? "bg-white dark:bg-zinc-700 text-brand-primary shadow-sm" 
            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        )}
      >
        हिंदी
      </button>
    </div>
  );
}
