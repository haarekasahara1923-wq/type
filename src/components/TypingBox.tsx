"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useTypingStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Keyboard, Type } from "lucide-react";

// Remington Gail / Standard Hindi Mapping based on the provided Keyboard Layout
const HINDI_KEY_MAP: Record<string, string> = {
  'q': 'ौ', 'w': 'ै', 'e': 'ा', 'r': 'ी', 't': 'ू', 'y': 'ब', 'u': 'ह', 'i': 'ग', 'o': 'द', 'p': 'ज',
  'a': 'ो', 's': 'े', 'd': 'अ', 'f': 'ि', 'g': 'ु', 'h': 'प', 'j': 'र', 'k': 'क', 'l': 'त', ';': 'च',
  'z': 'ण', 'x': 'ं', 'c': 'म', 'v': 'न', 'b': 'व', 'n': 'ल', 'm': 'स', ',': 'य', '.': 'श', '/': 'ष',
  ' ': ' ',
  // Standard Gail caps mapping (approximate for the requested keys)
  'Q': 'ौ', 'W': 'ै', 'E': 'ा', 'R': 'ी', 'T': 'ू', 'Y': 'ब', 'U': 'ह', 'I': 'ग', 'O': 'द', 'P': 'ज',
  'A': 'ो', 'S': 'े', 'D': 'अ', 'F': 'ि', 'G': 'ु', 'H': 'प', 'J': 'र', 'K': 'क', 'L': 'त', ':': 'च',
  'Z': 'ण', 'X': 'ं', 'C': 'म', 'V': 'न', 'B': 'व', 'N': 'ल', 'M': 'स', '<': 'य', '>': 'श', '?': 'ष'
};

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
    // Only focus after a short delay to prevent the page from jumping down on load
    const timer = setTimeout(() => {
      focusInput();
    }, 500);
    return () => clearTimeout(timer);
  }, [focusInput]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;
    
    const newVal = e.target.value;

    if (language === 'English') {
      setUserInput(newVal);
      return;
    }

    // Hindi Logic (Supports Mobile and Desktop)
    // If text was added
    if (newVal.length > userInput.length) {
      const addedText = newVal.slice(userInput.length);
      let mappedText = "";
      
      for (const char of addedText) {
        // Map Remington Gail keys to Hindi Unicode characters
        mappedText += HINDI_KEY_MAP[char] || char;
      }
      
      setUserInput(userInput + mappedText);
    } else {
      // Handles Backspace/Deletions
      setUserInput(newVal);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;

    // Prevent default scroll/behavior for certain keys if needed
    if (e.key === 'Tab') {
      e.preventDefault();
    }
  };


  // Split content into grapheme clusters for rendering (prevents Hindi matras from detaching)
  const renderDisplayContent = () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const segmenter = typeof Intl !== 'undefined' && (Intl as any).Segmenter 
      ? new (Intl as any).Segmenter(undefined, { granularity: 'grapheme' }) 
      : null;
    
    // Convert to arrays for easy comparison
    const contentSegments = segmenter 
      ? Array.from(segmenter.segment(content)).map((s: any) => s.segment)
      : content.split("");
      
    // For the typed text, we need to know WHICH segment we are in.
    // However, it's safer to compare string prefixes for "typed" status.
    
    let currentByteIndex = 0;

    return contentSegments.map((segment, index) => {
      const segmentLength = segment.length;
      const segmentInUser = userInput.substring(currentByteIndex, currentByteIndex + segmentLength);
      
      let status = "neutral";
      if (currentByteIndex < userInput.length) {
        status = segmentInUser === segment ? "typed" : "error";
      } else if (currentByteIndex === userInput.length) {
        status = "current";
      }
      
      currentByteIndex += segmentLength;

      return (
        <span
          key={index}
          id={status === "current" ? "current-char" : undefined}
          className={cn(
            "inline-block relative transition-all duration-100",
            status === "typed" && "text-zinc-500 dark:text-zinc-400 opacity-60", // More visible typed text
            status === "error" && "text-red-600 bg-red-50 dark:bg-red-900/30 font-bold underline decoration-wavy",
            status === "current" && "text-brand-primary font-black border-b-[3px] border-brand-primary",
            status === "neutral" && "text-zinc-900 dark:text-zinc-100", // Darker neutral text for better contrast
            language === "Hindi" ? "font-mangal text-[38px] md:text-4xl mx-0.5 leading-[1.7]" : "font-english text-2xl"
          )}
        >
          {segment === " " ? "\u00A0" : segment}
        </span>
      );
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */
  };

  // Sync scroll of display area to the current character
  useEffect(() => {
    const currentChar = document.getElementById("current-char");
    if (currentChar && displayRef.current) {
      const parent = displayRef.current;
      const offset = currentChar.offsetTop;
      // Adjusted scroll buffer for mobile and desktop
      if (offset > parent.scrollTop + 120 || offset < parent.scrollTop) {
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
            {language === "Hindi" && <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Mangal Script Exam</span>}
          </div>
          <div 
            ref={displayRef}
            className="h-64 overflow-y-auto p-12 select-none text-justify scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
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
              Student Typing Area (Remington Gail)
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
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={language === 'Hindi' ? "यहाँ टाइप करना शुरू करें..." : "Start typing here..."}
            className={cn(
              "w-full h-44 p-8 md:p-12 bg-white dark:bg-zinc-950 resize-none outline-none leading-relaxed transition-all text-zinc-900 dark:text-zinc-50 shadow-inner",
              language === "Hindi" ? "font-mangal text-4xl" : "font-english text-xl"
            )}
            spellCheck={false}
            disabled={isFinished}
          />
          
          {!isFocused && !isFinished && (
            <div 
              className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[1px] z-10 flex items-center justify-center cursor-pointer"
              onClick={focusInput}
              aria-hidden="true"
            >
              <div className="bg-white dark:bg-zinc-800 px-6 py-4 rounded-2xl shadow-2xl border border-brand-primary active:scale-95 transition-all flex items-center gap-3">
                <div className="p-2 bg-brand-primary rounded-lg text-white">
                   <Keyboard size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-brand-primary font-black uppercase tracking-widest text-[11px]">Click to Type</span>
                  <span className="text-zinc-400 text-[9px] font-bold uppercase">{language} Mode Active</span>
                </div>
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



