"use client";

import { useEffect, useRef, useState } from "react";
import { useTypingStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function TypingBox() {
  const { content, userInput, setUserInput, language, isFinished } = useTypingStore();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const focusInput = () => {
    if (inputRef.current && !isFinished) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, [isFinished]);

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
          className={cn(
            "inline-block",
            status === "correct" && "char-correct",
            status === "incorrect" && "char-incorrect",
            status === "current" && "char-current",
            language === "Hindi" ? "font-hindi text-2xl" : "font-english text-xl"
          )}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  };

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto p-8 rounded-2xl shadow-2xl bg-white dark:bg-zinc-900 overflow-hidden cursor-text"
      onClick={focusInput}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary" />
      
      <div className="mb-6 leading-relaxed select-none tracking-wide text-zinc-600 dark:text-zinc-400">
        {renderContent()}
      </div>

      <textarea
        ref={inputRef}
        value={userInput}
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-default"
        autoFocus
        spellCheck={false}
        disabled={isFinished}
      />
      
      {isFinished && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10">
          <div className="text-center p-6 rounded-xl bg-white dark:bg-zinc-800 shadow-xl border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-2xl font-bold mb-2">Test Completed!</h2>
            <p className="text-zinc-500">Check your results in the dashboard.</p>
          </div>
        </div>
      )}
    </div>
  );
}
