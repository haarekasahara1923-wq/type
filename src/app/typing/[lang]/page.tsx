"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { 
  Languages, 
  Copy, 
  Trash2, 
  Download, 
  Printer, 
  Type, 
  Maximize2,
  Minimize2,
  Info,
  Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function DynamicTypingPage() {
  const params = useParams();
  const lang = (params.lang as string) || "hindi";
  const capitalLang = lang.charAt(0).toUpperCase() + lang.slice(1);
  
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(18);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert("Text copied to clipboard!");
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all text?")) {
      setText("");
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${lang}-typing.doc`;
    document.body.appendChild(element);
    element.click();
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hindi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser does not support text to speech.");
    }
  };

  return (
    <div className={cn("bg-zinc-50 min-h-screen pb-20", isFullScreen && "fixed inset-0 z-[100] bg-white pt-0")}>
      <div className="max-w-6xl mx-auto px-4 pt-10">
        {!isFullScreen && (
          <div className="mb-8 space-y-4">
            <h1 className="text-3xl font-black text-zinc-900 flex items-center gap-3">
              <div className="p-2 bg-brand-primary rounded-xl text-white">
                <Languages size={24} />
              </div>
              {capitalLang} Online Typing {lang !== "english" && <span className="text-zinc-400 font-medium">(Phonetic English to {capitalLang})</span>}
            </h1>
            <p className="text-zinc-500 font-medium max-w-3xl">
              {lang === "english" 
                ? "Standard English typing tool for practice and document creation."
                : `Type in English (Roman) script and it will automatically convert into ${capitalLang} script.`}
            </p>
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white border border-zinc-200 rounded-t-[24px] p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-100 rounded-lg p-1">
              <button 
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                title="Decrease Font Size"
              >
                <Type size={14} />
              </button>
              <div className="px-2 text-xs font-bold text-zinc-500 w-8 text-center">{fontSize}</div>
              <button 
                onClick={() => setFontSize(Math.min(48, fontSize + 2))}
                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                title="Increase Font Size"
              >
                <Type size={20} />
              </button>
            </div>
            <div className="h-8 w-px bg-zinc-200 mx-2" />
            <button 
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-600"
              title="Fullscreen Mode"
            >
              {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-sm font-bold transition-all"
            >
              <Copy size={16} /> Copy
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-sm font-bold transition-all"
            >
              <Download size={16} /> Save as .DOC
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl text-sm font-bold transition-all"
            >
              <Printer size={16} /> Print
            </button>
            <button 
              onClick={handleSpeak}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl text-sm font-bold transition-all"
              title="Dictation - Read Text Aloud"
            >
              <Volume2 size={16} /> Dictation
            </button>
            <button 
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-all"
            >
              <Trash2 size={16} /> Clear
            </button>
          </div>
        </div>

        {/* Main Textarea */}
        <div className="relative group">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ fontSize: `${fontSize}px` }}
            placeholder={lang === "english" ? "Start typing here..." : `Start typing in English to convert it to ${capitalLang}...`}
            className={cn(
              "w-full bg-white border-x border-b border-zinc-200 p-8 min-h-[500px] outline-none transition-all",
              lang !== "english" ? "font-mangal" : "font-sans",
              isFullScreen && "min-h-[calc(100vh-80px)] border-none rounded-none"
            )}
          />
          <div className="absolute bottom-4 right-4 text-xs font-bold text-zinc-300 uppercase tracking-widest pointer-events-none text-right">
            By Emax Computer Education Center
          </div>
        </div>

        {!isFullScreen && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-zinc-200 rounded-[32px] p-8">
                <h3 className="text-xl font-black text-zinc-900 mb-4 flex items-center gap-2">
                  <Info className="text-brand-primary" size={20} />
                  How to use {capitalLang} Online Typing?
                </h3>
                <div className="text-zinc-600 space-y-4 text-sm leading-relaxed">
                  {lang === "english" ? (
                    <p>Simply type your text in the box above. You can use the toolbar to format, copy, or save your document.</p>
                  ) : (
                    <>
                      <p>
                        1. Type the {capitalLang} word phonetically using English letters. For example, to type <strong>&quot;नमस्ते&quot;</strong>, type <strong>&quot;namaste&quot;</strong>.
                      </p>
                      <p>
                        2. After typing each word, press the <strong>SPACE</strong> key.
                      </p>
                      <p>
                        3. If you get the wrong word, press <strong>BACKSPACE</strong> to see alternatives.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-100 rounded-[32px] p-6">
                <h4 className="font-bold text-orange-900 mb-4">Quick Links</h4>
                <div className="space-y-3">
                  <Link href={`/typing-test?lang=${capitalLang === 'English' ? 'English' : 'Hindi'}`} className="block p-3 bg-white border border-orange-200 rounded-xl text-sm font-bold text-orange-700 hover:bg-orange-500 hover:text-white transition-all">
                    {capitalLang} Typing Test
                  </Link>
                  <Link href={`/keyboard/${lang}`} className="block p-3 bg-white border border-orange-200 rounded-xl text-sm font-bold text-orange-700 hover:bg-orange-500 hover:text-white transition-all">
                    {capitalLang} Virtual Keyboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
