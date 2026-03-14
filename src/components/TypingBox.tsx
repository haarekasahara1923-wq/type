"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useTypingStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function TypingBox() {
  const { content, userInput, setUserInput, language, isFinished, isStarted } = useTypingStore();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const focusInput = useCallback(() => {
    if (inputRef.current && !isFinished) {
      inputRef.current.focus();
    }
  }, [isFinished]);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;
    setUserInput(e.target.value);
  };

  // Split content into characters for rendering
  const renderContent = () => {
    const chars = content.split("");
    const userChars = userInput.split("");

    return chars.map((char, index) => {
      let status = "neutral";
      if (index < userChars.length) {
        status = userChars[index] === char ? "correct" : "incorrect";
      } else if (index === userChars.length) {
        status = "current";
      }

      return (
        <span
          key={index}
          id={index === userChars.length ? "current-char" : undefined}
          className={cn(
            "inline-block relative transition-colors duration-100",
            status === "correct" && "text-zinc-800 dark:text-zinc-200 bg-emerald-50 dark:bg-emerald-900/20",
            status === "incorrect" && "text-rose-500 bg-rose-50 dark:bg-rose-900/30 font-bold",
            status === "current" && isFocused && "bg-brand-primary/10 text-brand-primary",
            status === "neutral" && "text-zinc-300 dark:text-zinc-600",
            language === "Hindi" ? "font-hindi text-3xl mx-px" : "font-english text-2xl"
          )}
        >
          {char === " " ? "\u00A0" : char}
          {status === "current" && isFocused && (
            <span className="absolute left-0 bottom-0 w-full h-1 bg-brand-primary animate-pulse" />
          )}
        </span>
      );
    });
  };

  // Logic to scroll to current character
  useEffect(() => {
    const currentChar = document.getElementById("current-char");
    if (currentChar && containerRef.current) {
      const parent = containerRef.current;
      const offset = currentChar.offsetTop;
      if (offset > parent.scrollTop + 200) {
        parent.scrollTo({ top: offset - 100, behavior: "smooth" });
      } else if (offset < parent.scrollTop) {
         parent.scrollTo({ top: offset - 100, behavior: "smooth" });
      }
    }
  }, [userInput]);

  return (
    <div 
      className={cn(
        "relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden transition-all duration-300",
        isFocused ? "shadow-[0_20px_50px_rgba(255,102,0,0.15)] ring-2 ring-brand-primary/20" : "shadow-xl border border-zinc-200 dark:border-zinc-800"
      )}
      onClick={focusInput}
    >
      <div 
        ref={containerRef}
        className="h-[320px] overflow-y-auto p-12 bg-white dark:bg-zinc-900 cursor-text scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
      >
        <div className="leading-relaxed select-none tracking-wide text-justify">
          {renderContent()}
        </div>
      </div>

      <textarea
        ref={inputRef}
        value={userInput}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-default z-10"
        autoFocus
        spellCheck={false}
        disabled={isFinished}
      />
      
      {!isFocused && !isFinished && (
        <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-white dark:bg-zinc-800 px-6 py-3 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 animate-bounce">
            <p className="text-brand-primary font-bold">Type any key to start typing</p>
          </div>
        </div>
      )}


      {isFinished && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/90 backdrop-blur-md z-30">
          <div className="text-center p-8 rounded-3xl bg-white dark:bg-zinc-800 shadow-2xl border border-brand-primary/20 scale-110">
            <h2 className="text-3xl font-black mb-2 text-zinc-900 dark:text-white uppercase tracking-tighter">Time&apos;s Up!</h2>
            <p className="text-zinc-500 font-medium">Test completed. Please wait for results.</p>
          </div>
        </div>
      )}
    </div>
  );
}

