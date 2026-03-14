"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useTypingStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Keyboard, Type } from "lucide-react";

export default function TypingBox() {
  const { content, userInput, setUserInput, language, isFinished } = useTypingStore();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
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

  // Split content into grapheme clusters for rendering (prevents Hindi matras from detaching)
  const renderDisplayContent = () => {
    // Falls back to simple split if Intl.Segmenter is not available
    const segmenter = typeof Intl !== 'undefined' && (Intl as any).Segmenter 
      ? new (Intl as any).Segmenter(undefined, { granularity: 'grapheme' }) 
      : null;
    
    const chars = segmenter 
      ? Array.from(segmenter.segment(content)).map((s: any) => s.segment)
      : content.split("");
      
    const userChars = segmenter 
      ? Array.from(segmenter.segment(userInput)).map((s: any) => s.segment)
      : userInput.split("");

    return chars.map((char, index) => {
      let status = "neutral";
      if (index < userChars.length) {
        status = userChars[index] === char ? "typed" : "error";
      } else if (index === userChars.length) {
        status = "current";
      }

      return (
        <span
          key={index}
          id={index === userChars.length ? "current-char" : undefined}
          className={cn(
            "inline-block relative transition-all duration-75",
            status === "typed" && "text-zinc-400 dark:text-zinc-600",
            status === "error" && "text-red-500 bg-red-100 dark:bg-red-900/30 font-bold",
            status === "current" && "text-brand-primary font-bold border-b-2 border-brand-primary",
            status === "neutral" && "text-zinc-800 dark:text-zinc-200",
            language === "Hindi" ? "font-mangal text-4xl mx-0.5 leading-[1.6]" : "font-english text-2xl"
          )}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  };


  // Sync scroll of display area to the current character
  useEffect(() => {
    const currentChar = document.getElementById("current-char");
    if (currentChar && displayRef.current) {
      const parent = displayRef.current;
      const offset = currentChar.offsetTop;
      if (offset > parent.scrollTop + 150) {
        parent.scrollTo({ top: offset - 80, behavior: "smooth" });
      } else if (offset < parent.scrollTop) {
        parent.scrollTo({ top: offset - 80, behavior: "smooth" });
      }
    }
  }, [userInput]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Upper Section: Reference Text */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-b from-brand-primary/20 to-transparent rounded-3xl blur-xl opacity-20" />
        <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em]">
              <Type size={14} className="text-brand-primary" />
              Examination Text Panel
            </div>
            {language === "Hindi" && <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-bold">Mangal Font</span>}
          </div>
          <div 
            ref={displayRef}
            className="h-56 overflow-y-auto p-10 leading-[1.8] select-none text-justify scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
          >
            {renderDisplayContent()}
          </div>
        </div>
      </div>

      {/* Lower Section: Typing Input */}
      <div className="relative group">
        <div className={cn(
          "relative bg-white dark:bg-zinc-900 border-2 rounded-[2rem] overflow-hidden transition-all duration-300 shadow-2xl",
          isFocused ? "border-brand-primary ring-4 ring-brand-primary/10" : "border-zinc-200 dark:border-zinc-800"
        )}>
          <div className="bg-zinc-50 dark:bg-zinc-800/50 px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
             <div className="flex items-center gap-2 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em]">
              <Keyboard size={14} className="text-brand-primary" />
              Student Typing Area
            </div>
            <div className="flex gap-1">
               <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
               <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
               <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            </div>
          </div>
          
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Click here and start typing the above text..."
            className={cn(
              "w-full h-40 p-10 bg-transparent resize-none outline-none leading-relaxed transition-all",
              language === "Hindi" ? "font-hindi text-2xl" : "font-english text-xl text-zinc-800 dark:text-zinc-100"
            )}
            spellCheck={false}
            disabled={isFinished}
          />
          
          {!isFocused && !isFinished && (
            <div 
              className="absolute inset-x-0 bottom-0 top-[45px] bg-white/60 dark:bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center cursor-pointer"
              onClick={focusInput}
            >
              <div className="bg-white dark:bg-zinc-800 px-8 py-4 rounded-2xl shadow-2xl border border-brand-primary/20 animate-bounce flex items-center gap-3">
                <div className="p-2 bg-brand-primary rounded-lg text-white">
                   <Keyboard size={18} />
                </div>
                <span className="text-brand-primary font-black uppercase tracking-widest text-xs">Click inside to activate typing</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {isFinished && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-[100] animate-in fade-in duration-500">
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] shadow-2xl border border-brand-primary/30 text-center max-w-md w-full mx-4 scale-110">
            <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <Type className="text-brand-primary" size={32} />
            </div>
            <h2 className="text-3xl font-black mb-2 text-zinc-900 dark:text-white uppercase tracking-tighter italic">Exam Finished!</h2>
            <p className="text-zinc-500 font-medium mb-2">Analyzing your performance data...</p>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-6">
               <div className="h-full bg-brand-primary animate-[loading_2s_ease-in-out_infinite]" style={{width: '60%'}} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


